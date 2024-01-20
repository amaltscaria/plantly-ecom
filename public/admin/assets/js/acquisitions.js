const fetchData = async () => {
  try {
    const response = await fetch('/admin/orderData');
    if (response.status === 200) {
      const orders = await response.json();
      const {orders:data} = orders;
      console.log(data)
      let cod = 0, online = 0, partial = 0;
      data.forEach(element => {
        if(element.paymentMethod === 'Online Payment')online++;
        else if(element.paymentMethod === 'Partial')partial++;
        else cod++;
      });
      // Call the createChart function with the fetched orders data
      createDoughnutChart(cod,online,partial);
      createPolarChart(data);
      createBarChart(data);
    }
  } catch (err) {
    console.log(err);
  }
};

// Function to create the bar chart
function createBarChart(orders) {
  const data = {};

  orders.forEach((item) => {
    item.products.forEach((element) => {
      const orderDate = new Date(item.orderDate);
      const month = orderDate.getMonth(); // Extract the month (0-11)

      if (data[month] === undefined) data[month] = { count: 1, totalSales: element.price*element.quantity };
      else {
        data[month].count++;
        data[month].totalSales += element.price*element.quantity;
      }
    });
  });

  const transformedData = Object.keys(data).map((month) => ({
    label: getMonthName(parseInt(month)), // Convert month number to month name
    value: data[month].count,
    totalSales: data[month].totalSales,
  }));

  new Chart(document.getElementById('acquisitions'), {
    type: 'bar',
    data: {
      labels: transformedData.map((row) => row.label),
      datasets: [
        {
          label: 'Monthly Sales Count',
          data: transformedData.map((row) => row.value),
          backgroundColor: '#4bc962',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
        {
          label: 'Monthly Total Sales',
          data: transformedData.map((row) => row.totalSales),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
        },
      ],
    },
  });
}

// Function to create the doughnut chart
function createDoughnutChart(cod,online,partial) {
  // Use the data you want for the doughnut chart
  const data = [
    { label: 'Cash On Delivery', value: cod },
    { label: 'RazorPay', value: online },
    { label: 'Partial(wallet+other options)', value: partial },
  ];
  new Chart(document.getElementById('doughnut'), {
    
    type: 'doughnut',
    data: {
      labels: data.map(item => item.label),
      datasets: [
        {
          label: 'My First Dataset',
          data: data.map(item => item.value),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  });
}

// Function to create the polar area chart
function createPolarChart(orders) {
  // Use the data you want for the polar area chart
  const data = {};
  orders.forEach(item=>{
    item.products.forEach(element=>{
      const {name} = element.product;
      const quantity = element.quantity;
      if(data[name])data[name]+=quantity;
      else data[name]=quantity;
      
    })
  })
  const transformedData = Object.keys(data).map((plantName) => ({
    label: plantName,
    value: data[plantName],
  }));
  new Chart(document.getElementById('polar'), {
    type: 'polarArea',
    data: {
      labels: transformedData.map(item => item.label),
      datasets: [
        {
          label: 'My First Dataset',
          data: transformedData.map(item => item.value),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)',
          ],
        },
      ],
    },
  });
}
// Function to get month name from month number
function getMonthName(monthNumber) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthNumber];
}
// Call fetchData to fetch data and create charts on page load
fetchData();
