import React, { useEffect, useRef, useState } from 'react'

import { IDescriptionProductComponent } from '@/interfaces/store-interface'
import { IconUpArrow } from '@/shared/icons'

import styles from './description-product.module.scss'

const DescriptionProductComponent: React.FC<IDescriptionProductComponent> = ({ product }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false)

  const toggleDescription = () => {
    setDescriptionExpanded(!isDescriptionExpanded)
  }
  const [showToggle, setShowToggle] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current
      setShowToggle(element.scrollHeight > element.clientHeight)
    }
  }, [product.description])
  return (
    <>
      {product.description && (
        <div className={styles.description}>
          <h2 className={`text-3 ${styles.description__title}`}>Опис</h2>
          <div
            ref={contentRef}
            className={`${styles.description__content} ${
              isDescriptionExpanded ? styles.contentExpanded : ''
            }`}
            onClick={toggleDescription}
          >
            <p className={`text-5 ${styles.description__content_text}`}>{product.description}</p>
          </div>
          {showToggle && (
            <button
              className={`${styles.description__toggle} ${isDescriptionExpanded ? styles.description__toggle_up : ''}`}
              onClick={toggleDescription}
            >
              <IconUpArrow />
            </button>
          )}
        </div>
      )}
      {product.features && (
        <div>
          <h3 className={`text-3 ${styles.features}`}>Характеристки</h3>
          <ul className={`text-4 ${styles.features_list}`}>
            {product.features.map((feature, i) => (
              <li key={i} className={styles.features__item}>
                <span className={styles.features__key}>{feature.name}:</span>
                <span className={styles.features__value}>{feature.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default DescriptionProductComponent
