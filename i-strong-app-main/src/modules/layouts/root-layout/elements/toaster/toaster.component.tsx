import { AnimatePresence, motion } from 'framer-motion'

import { FC } from 'react'

import { IconTick, IconWarning } from '@/shared/icons'
import { useCommonStore } from '@/shared/stores'

import styles from './toaster.module.scss'

//interface
interface IToaster {}

//component
export const ToasterComponent: FC<Readonly<IToaster>> = () => {
  const errorText = useCommonStore((state) => state.errorText)
  const successfulText = useCommonStore((state) => state.successfulText)
  const shouldShowToaster = errorText || successfulText
  //return
  return (
    <AnimatePresence>
      {shouldShowToaster && (
        <motion.div
          className={styles.toaster}
          layout
          key={'toaster'}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        >
          {errorText ? (
            <IconWarning />
          ) : (
            <div className={styles.toaster__successful}>
              <IconTick />
            </div>
          )}

          <span>{errorText ? errorText : successfulText}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default ToasterComponent
