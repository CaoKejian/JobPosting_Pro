import React, { useState, useEffect } from 'react';
import './index.css'

export interface MessageObj {
  message: string,
  type: string,
  onClose: () => void,
}
function Message({ message, type, onClose }: MessageObj) {
  const [isVisible, setIsVisible] = useState(true);
  const [svg, setSvg] = useState('#success')
  useEffect(() => {
    switch (type) {
      case 'success':
        setSvg('#success')
        break;
      case 'warning':
        setSvg('#warning')
        break;
      case 'message':
        setSvg('#message')
        break;
      default:
        break;
    }
  })
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000); // 3秒后自动关闭消息
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    isVisible && (
      <div className={`message ${type}`}>
        <svg className='message-svg'><use xlinkHref={svg}></use></svg>
        <p>{message}</p>
      </div>
    )
  );
}

export default Message;
