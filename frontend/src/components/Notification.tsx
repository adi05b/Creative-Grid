// frontend/src/components/Notification.tsx
import React from 'react';
import { Toast } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import './Notification.scss';

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          onClose={() => removeNotification(notification.id)}
          className={`notification-toast bg-${notification.type}`}
        >
          <Toast.Header>
            <strong className="me-auto">{notification.type === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body>{notification.message}</Toast.Body>
        </Toast>
      ))}
    </div>
  );
};

export default Notification;