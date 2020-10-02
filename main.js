(() => {
  function initScrollingSwitch() {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    const keys = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1 };

    function preventDefault(e) {
      e.preventDefault();
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }

    // modern Chrome requires { passive: false } when adding event
    let supportsPassive = false;
    try {
      window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
      }));
    } catch (e) { }

    const wheelOpt = supportsPassive ? { passive: false } : false;
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    function disableScroll() {
      window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
      window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
      window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
      window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function enableScroll() {
      window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
      window.removeEventListener('touchmove', preventDefault, wheelOpt);
      window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    return {
      disableScroll,
      enableScroll
    }
  }

  function initSlidesAnimation() {
    Array.from(document.querySelectorAll('.slide img'))
      .forEach((el, index) => {
        el.setAttribute('data-animate', index % 2 === 0 ? 'animate__fadeInLeft' : 'animate__fadeInRight')
      })
  }

  function initDateCounter() {
    const startDate = new Date(2020, 2, 28, 1, 30)
    const secondMilli = 1000
    const minuteMilli = 60 * secondMilli
    const hourMilli = 60 * minuteMilli
    const dayMilli = 24 * hourMilli
    const el = document.getElementById('counter')
    let prevDuration = -1

    function update() {
      const duration = Date.now() - startDate.getTime()
      if (duration !== prevDuration && duration - prevDuration >= 1000) {
        const numOfDays = Math.floor(duration / dayMilli)
        const numOfHours = Math.floor((duration % dayMilli) / hourMilli)
        const numOfMinutes = Math.floor((duration % hourMilli) / minuteMilli)
        const numOfSeconds = Math.floor((duration % minuteMilli) / secondMilli)
        el.innerHTML = `<strong>${numOfDays}</strong> 天 <strong>${numOfHours}</strong> 小時<br><strong>${numOfMinutes}</strong> 分鐘 <strong>${numOfSeconds}</strong> 秒`
        prevDuration = duration
      }
      requestAnimationFrame(update)
    }

    update()
  }

  function initSlides() {
    const slideTextList = [
      '嗨！子凌寶貝\n今天是我們在一起第一百天ㄌ\n所以我想說來做點什麼',
      '2020/03/28 1:30 a.m.\n在這夜深人靜的時刻\n令人開心的事情發生ㄌ',
      '轉眼間來到ㄌ第一百天\n這過程中說完全沒有任何爭執絕對是騙人的\n我們有過各種小摩擦\n很慶幸的是你願意跟我用 Debug 的方式找出問題、解決問題',
      '雖然你常說自己沒信心、放不開之類ㄉ\n但看著你有逐漸開朗起來也讓我很開心',
      '最後\n我們會越來越好ㄉ',
      '100 天快樂 ❤️'
    ]

    const contentWrapper = document.getElementById('content-wrapper')
    const numOfSlides = document.querySelectorAll('.slide').length
    let currentIndex = -1
    let typed = null
    initSlidesAnimation()

    function nextSlide() {
      if (numOfSlides <= currentIndex) return
      currentIndex++
      if (currentIndex % 2 === 0) {
        contentWrapper.classList.remove('right')
        contentWrapper.classList.add('left')
      } else {
        contentWrapper.classList.remove('left')
        contentWrapper.classList.add('right')
      }
      const slide = document.getElementById(`slide-${currentIndex}`)
      if (!slide) return
      setTimeout(() => {
        window.scrollTo({
          top: slide.offsetTop,
          left: 0,
          behavior: 'smooth'
        })
      }, 100)

      if (slideTextList[currentIndex]) {
        contentWrapper.style.display = 'flex'
        if (typed) {
          typed.destroy()
          typed = null
          document.getElementById('content').innerHTML = ''
        }
        typed = new Typed('#content', {
          strings: slideTextList[currentIndex].split('\n'),
          typeSpeed: 100,
          backSpeed: 80,
          startDelay: 1000,
          onComplete: () => setTimeout(() => {
            typed.destroy()
            typed = null
            nextSlide()
          }, 1000)
        })
      } else {
        contentWrapper.style.display = 'none'
      }

      const img = slide.querySelector('img')
      if (!img) return
      img.classList.length = 0
      img.classList.add('animate__animated', img.getAttribute('data-animate'))
    }

    nextSlide()

    return {
      nextSlide
    }
  }

  function main() {
    initDateCounter()
    const { disableScroll } = initScrollingSwitch()
    disableScroll()
    initSlides()
  }

  window.addEventListener('load', () => {
    main()
  })
})()
