import React, { memo, useEffect, useRef, useState } from 'react'
import s from './Home.module.scss'
import type { FC, ReactNode } from 'react'
import Right from '../component/Right'
import { Root2, portTree } from '../common/Common'
import Left from '../component/Left'
import Message from '../share/Message'
import OutLine from './OutLine'
interface IProps {
  children?: ReactNode
}

const Home: FC<IProps> = () => {
  const rightMain = useRef<HTMLDivElement | null>(null)
  const [title, setTitle] = useState('')
  const [currentMap, setCurrentMap] = useState('')
  const [message, setMessage] = useState<{ text: string, type: string, autoClose: boolean }>()
  useEffect(() => {

    if (rightMain.current) {
      const searchText = title;
      if (searchText !== '') {
        localStorage.setItem('Ttitle', searchText)
      }
      const xpathExpression = `//h1[text()='${searchText}']`;
      const matchingElements = document.evaluate(
        xpathExpression,
        rightMain.current,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      if (matchingElements.snapshotLength > 0) {
        const matchingElement: any = matchingElements.snapshotItem(0);
        const rect = matchingElement!.getBoundingClientRect();
        const distanceToTop = rect.top + window.scrollY;
        scrollToHeight(distanceToTop)
        localStorage.setItem('toTop', distanceToTop)
      }
    }
  }, [title]);
  useEffect(() => {
    const distance = parseInt(localStorage.getItem('toTop') as string)
    if (distance) {
      scrollToHeight(distance)
      setTimeout(() => {
        setMessage({
          text: '已经恢复之前的位置啦',
          type: 'success',
          autoClose: true,
        });
      }, 1000);
    }
  }, [])
  const scrollToHeight = (targetY: number) => {
    window.scrollTo({ top: targetY - 16, behavior: 'smooth' });
  }
  const updateTitle = (title: string) => {
    if (title === currentMap) {
      setMessage({
        text: '已经在当前位置啦',
        type: 'message',
        autoClose: true,
      });
      return
    }
    setCurrentMap(title)
    setTitle(title)
  }
  const [activeItemId, setActiveItemId] = useState('');

  useEffect(() => {
    const Ttitle = localStorage.getItem('Ttitle') as string
    let count = 0
    if (Ttitle && count === 0) {
      setActiveItemId(localStorage.getItem('Ttitle') as string);
      count += 1
      return
    }

    const headers = document.querySelectorAll('.Ttitle'); // 选择所有的 H1 标签
    const scrollIntervals: { id: string, start: number, end: number }[] = []; // 存储每个 H1 标签的滚动区间

    for (const header of headers) {
      const headerId = header.getAttribute('id');
      const headerOffsetTop = header.getBoundingClientRect().top;
      const headerHeight = header.clientHeight;

      // 计算出每个 H1 标签的滚动区间
      const headerScrollStart = headerOffsetTop;
      const headerScrollEnd = headerOffsetTop + headerHeight;

      scrollIntervals.push({ id: header.innerHTML, start: headerScrollStart, end: headerScrollEnd + 1800 });
    }

    const handleScroll = () => {
      // 获取当前滚动位置
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      for (const interval of scrollIntervals) {
        if (scrollY >= interval.start && scrollY <= interval.end) {
          // 当前 H1 标签在可视区域内
          setActiveItemId(interval.id);
          // break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className={s.wrapper}>
      <div className={s.left}>
        <Left updateTitle={updateTitle} />
      </div>
      <div className={s.right} ref={rightMain}>
        {
          portTree.map((item: Root2, index: number) => {
            return <Right key={index} portObj={item} />
          })
        }
      </div>
      <OutLine updateTitle={updateTitle} activeItemId={activeItemId} />
      {message && (
        <Message
          message={message.text}
          type={message.type}
          onClose={() => setMessage(undefined)}
        />
      )}
    </div>
  )
}

export default memo(Home)