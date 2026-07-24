const Order = require("../../models/Orders")
const Product = require("../../models/Products")

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

const getSalesAnalytics = async(req,res) => {
    try
    {
      const {type,analyticFilter} = req.body;

      let startDate = "";
      let endDate = "";
      let resultLength = 6;

      switch (analyticFilter) {
        
        case "All-Time":
        startDate = new Date(0);
        endDate = new Date();
        resultLength = 12;
        break;
      
        case "Past-3-months":
        startDate = new Date(new Date().setMonth(new Date().getMonth()-3));
        endDate = new Date();
        resultLength = 3;
        break;

        case "Past-6-months":
        startDate = new Date(new Date().setMonth(new Date().getMonth()-6));
        endDate = new Date();
        break;

      default :
        startDate = new Date(0);
        endDate = new Date();  
        break;

    }
          const [overview,discountAmount,revenuePerCategory,monthlyRevenueTrend] = await Promise.all([
            Order.aggregate([
              { $match: { 
                PaymentStatus: "Paid",
                OrderCreationDate : {
                  $gte : startDate,
                  $lte : endDate
                }
              } },
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$OrderTotal" },
                  averageOrderValue: { $avg: "$OrderTotal" },
                },
              },
              {
                $project: {
                  totalRevenue  : { $round: ["$totalRevenue", 2] },
                  averageOrderValue : { $round: ["$averageOrderValue", 2] },
                },
              },
            ]),
            Order.aggregate([
              {
                $unwind : "$OrderItems"
              },
              {
                $match : {
                  PaymentStatus: "Paid",
                  OrderCreationDate : {
                    $gte : startDate,
                    $lte : endDate
                  },
                  "OrderItems.SalePrice" : {$exists : true, $ne : null}
                }
              },
              {
                $group : {
                  _id : null,
                  totalQuantity : {$sum : "$OrderItems.Quantity"},
                  total : {
                    $sum :{
                      $multiply  : [
                        "$OrderItems.Quantity",
                        {$subtract : [
                          "$OrderItems.Price",
                          "$OrderItems.SalePrice"
                        ]}
                      ]
                    }
                  }
                }
              }
            ]),
            Order.aggregate([
              { $unwind: "$OrderItems" }, 
              {
                $match : {
                  PaymentStatus: "Paid",
                  OrderCreationDate : {
                    $gte : startDate,
                    $lte : endDate
                  }
                }
              },
              {
                $group: {
                  _id: "$OrderItems.Category", 
                  totalRevenue: {
                    $sum: {
                      $multiply: [
                        "$OrderItems.Quantity",
                        { $ifNull: ["$OrderItems.SalePrice", "$OrderItems.Price"] }
                      ]
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  category: "$_id",
                  totalRevenue: 1
                }
              },
              { $sort: { totalRevenue: -1 } } 
            ]),
            Order.aggregate([
              {
                $match: {
                  PaymentStatus: "Paid",
                  OrderCreationDate: {
                    $gte: startDate
                  },
                },
              },
              {
                $group: {
                  _id : { month: { $month: "$OrderCreationDate" }, year: { $year: "$OrderCreationDate" } },
                  revenue: { $sum: "$OrderTotal" },
                },
              },
              { $sort: { "_id.year": -1, "_id.month": -1 } },
            ]).limit(resultLength)
          ])

          const RevenueTrendData = monthlyRevenueTrend.map((item) => 
          ({
            Month : `${months[item._id.month - 1]} ${item._id.year}`,
            Revenue : item.revenue,
          })
          )
          
          // Handle empty results
          const overviewData = overview[0] || { totalRevenue: 0, averageOrderValue: 0 };
          const discountData = discountAmount[0] || { total: 0, totalQuantity: 1 };
          
          res.status(200).json({
            success : true,
            totalRevenue : overviewData.totalRevenue,
            revenuePerItem : discountData.totalQuantity > 0 
              ? (overviewData.totalRevenue / discountData.totalQuantity).toFixed(2) 
              : "0.00",
            averageOrderValue : overviewData.averageOrderValue,
            discountTotal : discountData.total.toFixed(2),
            revenuePerCategory,
            RevenueTrendData : RevenueTrendData.reverse()
          })
    }
    catch(e)
    {
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Sales Analytics | Internal Server Error"
        })
    }
}

const getOrderAnalytics = async(req,res) => {
    try
    {

      const {type,analyticFilter} = req.body;

      let startDate = "";
      let endDate = "";
      let resultLength = 6;

      switch (analyticFilter) {
        
        case "All-Time":
        startDate = new Date(0);
        endDate = new Date();
        resultLength = 12;
        break;
      
        case "Past-3-months":
        startDate = new Date(new Date().setMonth(new Date().getMonth()-3));
        endDate = new Date();
        resultLength = 3;
        break;

        case "Past-6-months":
        startDate = new Date(new Date().setMonth(new Date().getMonth()-6));
        endDate = new Date();
        break;

      default :
        startDate = new Date(0);
        endDate = new Date();  
        break;

      }

      const [totalOrders,completedOrders,pendingOrders,itemsPerOrder,monthlyOrderTrend,orderStatusDistribution] = await Promise.all([
          Order.countDocuments({
            PaymentStatus : "Paid",
            OrderCreationDate : {$gte: startDate , $lte : endDate}
          }) ,
          Order.countDocuments({
            OrderStatus : "Delivered",
            PaymentStatus : "Paid",
            OrderCreationDate : {$gte: startDate , $lte : endDate}
          }) ,
          Order.countDocuments({
            PaymentStatus : "Paid",
            OrderStatus : {$in : ["Confirmed","Processing","Shipping","Out for Delivery"]},
            OrderCreationDate : {$gte: startDate , $lte : endDate}
          }) ,
          Order.aggregate([
            {
              $match : {
                PaymentStatus : "Paid",
                OrderStatus : {$ne : "Cancelled"},
                OrderCreationDate : {$gte : startDate , $lte : endDate}
              }
            },
            {
              $group : {
                _id : 0,
                items : {$avg : {$size : "$OrderItems"} }
              }
            }
          ]) ,
          Order.aggregate([
            {
              $match : {
                PaymentStatus : "Paid",
                OrderStatus : {$ne : "Cancelled"},
                OrderCreationDate : {$gte : startDate , $lte : endDate}
              }
            },
            {
              $group : {
                _id :
                {
                  month: { $month: "$OrderCreationDate" },
                  year: { $year: "$OrderCreationDate" }
                },
                orders : {$sum : 1}
              }
            },
            {
              $sort : {"_id.year" : -1 , "_id.month" : -1}
            }
          ]).limit(resultLength),
          Order.aggregate([
            {
              $match : {
                PaymentStatus : "Paid",
                OrderCreationDate : {$gte : startDate , $lte : endDate}
              }
            },
            {
              $group : {
                _id : "$OrderStatus",
                statusCount : { $sum : 1 }
              }
            },
            {
              $project: {
                _id: 0,
                status: "$_id",
                statusCount : 1
              }
            }
          ])
      ]);

      const orderTrend = monthlyOrderTrend.map((item) => ({
        Month : `${months[item._id.month - 1]} ${item._id.year}`,
        Orders : item.orders,
      }))

      res.status(200).json({
        success : true,
        totalOrders,
        completedOrders,
        pendingOrders,
        averageItemsPerOrder : itemsPerOrder[0].items.toFixed(2),
        orderTrend : orderTrend.reverse(),
        orderStatusDistribution
      })
    }
    catch(e)
    {
      console.log(e);
      return res.status(500).json({
        success : false,
        message : "Order Analytics | Internal Server Error"
      })
    }
}

const getProductAnalytics = async(req,res) => {
  try
  {
    const {type,analyticFilter} = req.body;

    let startDate = "";
    let endDate = "";

    switch (analyticFilter) {
      
      case "All-Time":
      startDate = new Date(0);
      endDate = new Date();
      break;
    
      case "Past-3-months":
      startDate = new Date(new Date().setMonth(new Date().getMonth()-3));
      endDate = new Date();
      break;

      case "Past-6-months":
      startDate = new Date(new Date().setMonth(new Date().getMonth()-6));
      endDate = new Date();
      break;

    default :
      startDate = new Date(0);
      endDate = new Date();  
      break;

    }

    const [totalProductsSold,popularSize,averageProductPrice,outOfStockProducts,sizeTrend,performingProducts] = await Promise.all([
      await Order.aggregate([
        {$unwind : "$OrderItems"},
        {
          $match : {
            OrderStatus : {$ne : "Cancelled"},
            PaymentStatus : "Paid",
            "OrderCreationDate" : {$gte : startDate , $lte : endDate}
          } 
        },
        {
          $group : {
            _id : "$OrderItems.ProductId",
            units : {$sum : "$OrderItems.Quantity"}
          }
        },
        {
          $group : {
            _id : 0,
            totalUnits : {$sum : "$units"}
          }
        }
      ]),
      await Order.aggregate([
        { 
          $unwind: "$OrderItems" 
        },
        { 
          $match: { 
            OrderStatus : {$ne : "Cancelled"},
            PaymentStatus : "Paid",
            "OrderCreationDate": { $gte: startDate, $lte: endDate } 
          } 
        },
        { 
          $group: {
            _id: "$OrderItems.Size",
            totalQuantity: { $sum: "$OrderItems.Quantity" }
          }
        },
        { 
          $sort: { totalQuantity: -1 } 
        },
        { 
          $limit: 1 
        },
        { 
          $project: {
            _id : null,
            Size : "$_id",
            Quantity : "$totalQuantity"
          } 
        }
      ]),
      await Product.aggregate([
        { 
          $group: {
            _id: null,
            amount: { $avg: {$ifNull : ["$SalePrice", "$Price"]} }
          }
        }
      ]),
      await Product.aggregate([
        {
          $match : {"Size.quantity" : 0}
        },
        {
          $group : {
            _id : "$_id"
          }
        },
        {
          $count : "count"
        }
      ]),
      await Order.aggregate([
        { $unwind: "$OrderItems" },
        {
          $match : {
            OrderStatus : {$ne : "Cancelled"},
            PaymentStatus : "Paid",
            "OrderCreationDate" : {$gte : startDate , $lte : endDate}
          } 
        },
        {
          $group: {
            _id: "$OrderItems.Size",
            Quantity: { $sum: "$OrderItems.Quantity" }
          }
        },
        {
          $project: {
            _id: 0,
            size : "$_id",
            Quantity: 1
          }
        },
        {
          $sort: { Quantity: -1 } 
        }
      ]),
      await Order.aggregate([
        { $unwind: "$OrderItems" },
        { 
          $match: { 
            OrderStatus : {$ne : "Cancelled"},
            PaymentStatus : "Paid",
            "OrderCreationDate": { $gte: startDate, $lte: endDate } 
          } 
        },
        {
          $group: {
            _id: "$OrderItems.ProductId",
            totalQuantity: { $sum: "$OrderItems.Quantity" },
            title: { $first: "$OrderItems.Title" }, 
            image: { $first: "$OrderItems.Image" }, 
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 5 },
      ])
    ])

    res.status(200).json({
      success : true,
      totalProductsSold : totalProductsSold[0].totalUnits,
      averageProductPrice : (averageProductPrice[0].amount).toFixed(2),
      popularSize : popularSize[0],
      outOfStockProducts : outOfStockProducts[0].count,
      sizeTrend,
      performingProducts
    })
  }
  catch(e)
  {
    console.log(e);
    res.status(500).json({
      success : false,
      message : "Product Analytics | Internal Server Error"
    })
  }
}

module.exports = {
  getSalesAnalytics,
  getOrderAnalytics,
  getProductAnalytics
}