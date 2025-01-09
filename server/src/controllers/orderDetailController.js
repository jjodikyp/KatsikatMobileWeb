const { OrderDetail, Order, Customer, Treatment, Item, ShoePhoto } = require('../models');
const { Op } = require('sequelize');

const orderDetailController = {
  getByProcessTimeAndDateRange: async (req, res) => {
    try {
      const { processTime } = req.params;
      const { startDate, endDate } = req.query;

      console.log('Received request:', {
        processTime,
        startDate,
        endDate
      });

      // Validasi input
      if (!startDate || !endDate) {
        return res.status(400).json({
          status: 'error',
          message: 'startDate dan endDate harus diisi'
        });
      }

      // Query untuk mendapatkan data berdasarkan process_time dan rentang tanggal
      const query = {
        where: {
          process_time: processTime,
          status: {
            [Op.or]: ['not_yet', null]
          },
          due_date: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [
          {
            model: Order,
            as: 'order',
            include: [{
              model: Customer,
              as: 'customer',
              attributes: ['name']
            }]
          },
          {
            model: Treatment,
            as: 'treatment',
            attributes: ['name']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['name']
          },
          {
            model: ShoePhoto,
            as: 'shoes_photos',
            attributes: ['url_photo']
          }
        ],
        order: [['due_date', 'ASC']]
      };

      // Log query yang akan dijalankan
      console.log('Executing query with parameters:', {
        processTime,
        dateRange: { startDate, endDate },
        whereClause: query.where
      });

      const orderDetails = await OrderDetail.findAll(query);

      // Log hasil query
      console.log('Query results:', {
        totalFound: orderDetails.length,
        sampleDates: orderDetails.slice(0, 3).map(od => ({
          id: od.id,
          due_date: od.due_date,
          process_time: od.process_time
        }))
      });

      console.log(`Found ${orderDetails.length} orders for ${processTime} between ${startDate} and ${endDate}`);

      return res.json({
        status: 'success',
        data: orderDetails,
        meta: {
          total: orderDetails.length,
          filters: {
            processTime,
            dateRange: {
              start: startDate,
              end: endDate
            }
          }
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data orderan',
        error: error.message
      });
    }
  },

  getAllOrderDetails: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const query = {
        where: {
          status: {
            [Op.or]: ['not_yet', null]
          }
        }
      };

      // Tambahkan filter tanggal jika ada
      if (startDate && endDate) {
        query.where.due_date = {
          [Op.between]: [startDate, endDate]
        };
      }

      // Tambahkan includes
      query.include = [
        {
          model: Order,
          as: 'order',
          include: [{
            model: Customer,
            as: 'customer',
            attributes: ['name']
          }]
        },
        {
          model: Treatment,
          as: 'treatment',
          attributes: ['name']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['name']
        },
        {
          model: ShoePhoto,
          as: 'shoes_photos',
          attributes: ['url_photo']
        }
      ];

      query.order = [['due_date', 'ASC']];

      const orderDetails = await OrderDetail.findAll(query);

      console.log(`Found ${orderDetails.length} total orders${startDate ? ` between ${startDate} and ${endDate}` : ''}`);

      return res.json({
        status: 'success',
        data: orderDetails,
        meta: {
          total: orderDetails.length,
          filters: startDate ? {
            dateRange: {
              start: startDate,
              end: endDate
            }
          } : null
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil semua data orderan',
        error: error.message
      });
    }
  }
};

module.exports = orderDetailController; 