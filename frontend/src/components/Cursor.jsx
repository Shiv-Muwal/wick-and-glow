import { useEffect } from 'react';

export default function Cursor() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    let fx = 0;
    let fy = 0;
    let cx = 0;
    let cy = 0;

    const handleMove = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
    };

    const animate = () => {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      follower.style.left = `${fx}px`;
      follower.style.top = `${fy}px`;
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMove);
    animate();

    const hoverEls = document.querySelectorAll('a, button, [data-hover]');
    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
      });
    });

    return () => {
      document.removeEventListener('mousemove', handleMove);
    };
  }, []);

  return (
    <>
      <div className="cursor" />
      <div className="cursor-follower" />
    </>
  );
}

