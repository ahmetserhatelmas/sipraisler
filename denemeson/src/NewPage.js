import React, { useState, useEffect } from 'react';
import { Button, Table, Progress, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import ordersData from './orders.json';
import trendyolData from './trendyol.json';

const { Search } = Input;

function NewPage() {
  const navigate = useNavigate();
  const [originalUsersWithStoreId, setOriginalUsersWithStoreId] = useState([]);
  const [usersWithStoreId, setUsersWithStoreId] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [maxTotalPrice, setMaxTotalPrice] = useState(500);

  useEffect(() => {
    try {
      const jsonData = ordersData.data;

      const userGroups = jsonData.reduce((groups, order) => {
        if (order.raw.storeId) {
          const matchingTrendyolStore = trendyolData.find(
            trendyol => String(trendyol.storeId) === String(order.raw.storeId)
          );

          if (!matchingTrendyolStore) {
            console.log(`No matching Trendyol store found for order with storeId: ${order.raw.storeId}`);
          }

          const userId = String(order.raw.storeId);

          if (!groups[userId]) {
            groups[userId] = {
              storeId: order.raw.storeId,
              trendyolName: matchingTrendyolStore ? matchingTrendyolStore.name : 'N/A',
              totalPrice: order.raw.totalPrice || 0,
              numberOfOrders: 1,
              highestPriceOrder: order.raw.totalPrice || 0,
              lowestPriceOrder: order.raw.totalPrice || 0,
            };
          } else {
            groups[userId].totalPrice += order.raw.totalPrice || 0;
            groups[userId].numberOfOrders += 1;

            if (order.raw.totalPrice > groups[userId].highestPriceOrder) {
              groups[userId].highestPriceOrder = order.raw.totalPrice;
            }

            if (order.raw.totalPrice < groups[userId].lowestPriceOrder) {
              groups[userId].lowestPriceOrder = order.raw.totalPrice;
            }
          }
        }

        return groups;
      }, {});

      const groupedUsers = Object.values(userGroups);

      const totalRevenueValue = groupedUsers.reduce((total, user) => total + user.totalPrice, 0);
      setTotalRevenue(totalRevenueValue);

      const totalPriceValues = groupedUsers.map(user => user.totalPrice);
      const newMaxTotalPrice = totalPriceValues.reduce((sum, value) => sum + value, 0);
      setMaxTotalPrice(newMaxTotalPrice);

      const sortedUsers = groupedUsers.sort((a, b) => b.totalPrice - a.totalPrice);

      console.log('Sorted Users:', sortedUsers);
      setOriginalUsersWithStoreId(sortedUsers);
      setUsersWithStoreId(sortedUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  const navigateToPreviousPage = () => {
    setUsersWithStoreId(originalUsersWithStoreId);
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    const filteredUsers = originalUsersWithStoreId.filter(user =>
      user.storeId.toLowerCase().includes(inputValue.toLowerCase()) ||
      user.trendyolName.toLowerCase().includes(inputValue.toLowerCase())
    );

    setUsersWithStoreId(filteredUsers);
  };

  const columns = [
    {
      title: 'StoreId',
      dataIndex: 'storeId',
      key: 'storeId',
    },
    {
      title: 'Şube İsimleri',
      dataIndex: 'trendyolName',
      key: 'trendyolName',
    },
    {
      title: 'En Yüksek Sipariş',
      dataIndex: 'highestPriceOrder',
      key: 'highestPriceOrder',
      render: text => `₺${text.toFixed(1)}`,
    },
    {
      title: 'En Düşük Sipariş',
      dataIndex: 'lowestPriceOrder',
      key: 'lowestPriceOrder',
      render: text => `₺${text.toFixed(1)}`,
    },
    {
      title: 'Sipariş Sayıları',
      dataIndex: 'numberOfOrders',
      key: 'numberOfOrders',
      width: 100,
    },
    {
      title: 'Şube Cirosu',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text, record) => {
        const percentage = (text / maxTotalPrice) * 100;
        const roundedPercentage = Math.round(percentage * 10) / 10;
        const formattedPercentage = Number.isInteger(roundedPercentage)
          ? `${Math.round(percentage)}%`
          : `${roundedPercentage}%`;

        return (
          <div style={{ width: '100%' }}>
            <span>{`₺${text.toFixed(1)}`}</span>
            <Progress percent={roundedPercentage} showInfo={{ format: () => formattedPercentage }} />
          </div>
        );
      },
    },
  ];

  const tablePaginationStyles = {
    background: '#f5f5f5',
    border: '1px solid #ddd',
  };

  return (
    <div style={{ transform: 'scale(0.90)', transformOrigin: 'top' }}>
      <div style={{ marginTop: '25px', marginBottom: '10px' }}>
        <Button type="primary" onClick={navigateToPreviousPage}>
          Go Back
        </Button>
      </div>

      <div>
        <Search
          placeholder="Search by StoreId or Şube İsimleri"
          allowClear
          onChange={handleInputChange}
          style={{ marginBottom: 16 }}
        />

        <Table
          dataSource={usersWithStoreId}
          columns={columns}
          scroll={{ y: 400 }}
          pagination={{
            style: tablePaginationStyles,
            pageSize: 20, 
          }}
        />

        <div style={{ marginTop: '24px' }}>
          <strong>Toplam Ciro: ₺{totalRevenue.toFixed(2)}</strong>
        </div>
        <Progress
          percent={(totalRevenue / maxTotalPrice) * 100}
          showInfo={{ format: () => `${Math.round((totalRevenue / maxTotalPrice) * 10) / 10}%` }}
        />
      </div>
    </div>
  );
}

export default NewPage;
