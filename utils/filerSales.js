import Order from "../model/Orders.js";

export const filterSales = async (filter)=>{
    let orders;

    if (filter === 'daily') {
      orders = await Order.aggregate([
        {
          $match: {
            status: 'Delivered',
            $expr: {
              $eq: [
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$orderDate',
                  },
                },
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: new Date(),
                  },
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'customer',
            as: 'customer',
          },
        },
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'orderedProducts',
          },
        },
        {
          $project: {
            orderId: 1,
            paymentMethod: 1,
            price: '$products.price',
            product: '$orderedProducts.name',
            customer: '$customer.email',
            quantity: '$products.quantity',
            orderDate: 1,
          },
        },
      ]);
    } else if (filter === 'weekly') {
      orders = await Order.aggregate([
        {
          $match: {
            status: 'Delivered',
            $expr: {
              $gte: [
                {
                  $dateToString: {
                    date: '$orderDate',
                  },
                },
                {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: new Date(new Date().getTime() - 86400000 * 6),
                  },
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'customer',
            as: 'customer',
          },
        },
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'orderedProducts',
          },
        },
        {
          $project: {
            orderId: 1,
            paymentMethod: 1,
            price: '$products.price',
            product: '$orderedProducts.name',
            customer: '$customer.email',
            quantity: '$products.quantity',
            orderDate: 1,
          },
        },
      ]);
    } else if (filter === 'monthly') {
      orders = await Order.aggregate([
        {
          $match: {
            status: 'Delivered',
            $expr: {
              $eq:[
                {
                  $month:"$orderDate",
                },
                {
                  $month: new Date(),
                }
              ]
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'customer',
            as: 'customer',
          },
        },
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'orderedProducts',
          },
        },
        {
          $project: {
            orderId: 1,
            paymentMethod: 1,
            price: '$products.price',
            product: '$orderedProducts.name',
            customer: '$customer.email',
            quantity: '$products.quantity',
            orderDate: 1,
          },
        },
      ]);
    }else if (filter === 'yearly') {
        orders = await Order.aggregate([
          {
            $match: {
              status: 'Delivered',
              $expr: {
                $eq:[
                  {
                    $year:"$orderDate",
                  },
                  {
                    $year: new Date(),
                  }
                ]
              },
            },
          },
          {
            $lookup: {
              from: 'users',
              foreignField: '_id',
              localField: 'customer',
              as: 'customer',
            },
          },
          {
            $unwind: '$products',
          },
          {
            $lookup: {
              from: 'products',
              localField: 'products.product',
              foreignField: '_id',
              as: 'orderedProducts',
            },
          },
          {
            $project: {
              orderId: 1,
              paymentMethod: 1,
              price: '$products.price',
              product: '$orderedProducts.name',
              customer: '$customer.email',
              quantity: '$products.quantity',
              orderDate: 1,
            },
          },
        ]);
      }
      else if (filter && filter.length  === 2) {
        console.log(new Date(filter[0]), new Date(filter[1]))
        orders = await Order.aggregate([
          {
            $match: {
              status: 'Delivered',
              orderDate:{ $gte:new Date(filter[0]),$lte: new Date(filter[1])},
       
            },
          },
          {
            $lookup: {
              from: 'users',
              foreignField: '_id',
              localField: 'customer',
              as: 'customer',
            },
          },
          {
            $unwind: '$products',
          },
          {
            $lookup: {
              from: 'products',
              localField: 'products.product',
              foreignField: '_id',
              as: 'orderedProducts',
            },
          },
          {
            $project: {
              orderId: 1,
              paymentMethod: 1,
              price: '$products.price',
              product: '$orderedProducts.name',
              customer: '$customer.email',
              quantity: '$products.quantity',
              orderDate: 1,
            },
          },
        ]);
      }
    else {
      orders = await Order.aggregate([
        {
          $match: { status: 'Delivered' },
        },
        {
          $lookup: {
            from: 'users',
            foreignField: '_id',
            localField: 'customer',
            as: 'customer',
          },
        },
        {
          $unwind: '$products',
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'orderedProducts',
          },
        },
        {
          $project: {
            orderId: 1,
            paymentMethod: 1,
            price: '$products.price',
            product: '$orderedProducts.name',
            customer: '$customer.email',
            quantity: '$products.quantity',
            orderDate: 1,
          },
        },
      ]);
    }
    return orders;
}