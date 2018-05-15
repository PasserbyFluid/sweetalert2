import {undoScrollbar} from '../utils/scrollbarFix'
import {undoIOSfix} from '../utils/iosFix'
import * as dom from '../utils/dom/index'
import { swalClasses } from '../utils/classes.js'
import globalState, { resetActiveElement } from '../globalState'

/*
 * Global function to close sweetAlert
 */
const close = (onClose, onAfterClose) => {
  const container = dom.getContainer()
  const popup = dom.getPopup()
  if (!popup) {
    return
  }

  if (onClose !== null && typeof onClose === 'function') {
    onClose(popup)
  }

  dom.removeClass(popup, swalClasses.show)
  dom.addClass(popup, swalClasses.hide)
  clearTimeout(popup.timeout)

  if (!dom.isToast()) {
    resetActiveElement()
    window.onkeydown = globalState.previousWindowKeyDown
    globalState.windowOnkeydownOverridden = false
  }

  const removePopupAndResetState = () => {
    if (container.parentNode) {
      container.parentNode.removeChild(container)
    }
    dom.removeClass(
      [document.documentElement, document.body],
      [
        swalClasses.shown,
        swalClasses['no-backdrop'],
        swalClasses['has-input'],
        swalClasses['toast-shown']
      ]
    )

    if (dom.isModal()) {
      undoScrollbar()
      undoIOSfix()
    }

    if (onAfterClose !== null && typeof onAfterClose === 'function') {
      setTimeout(() => {
        onAfterClose()
      })
    }
  }

  // If animation is supported, animate
  if (dom.animationEndEvent && !dom.hasClass(popup, swalClasses.noanimation)) {
    popup.addEventListener(dom.animationEndEvent, function swalCloseEventFinished () {
      popup.removeEventListener(dom.animationEndEvent, swalCloseEventFinished)
      if (dom.hasClass(popup, swalClasses.hide)) {
        removePopupAndResetState()
      }
    })
  } else {
    // Otherwise, remove immediately
    removePopupAndResetState()
  }
}
export {
  close,
  close as closePopup,
  close as closeModal,
  close as closeToast
}
