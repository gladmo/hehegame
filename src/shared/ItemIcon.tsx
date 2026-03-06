import React from 'react'
import { ItemDef } from '@/data/items'

interface ItemIconProps {
  def: ItemDef
  /** Font size for emoji fallback, e.g. 26 or 'clamp(26px, 6.5vw, 42px)' */
  fontSize?: number | string
  /** CSS opacity */
  opacity?: number
  /** CSS filter */
  filter?: string
  /** Additional style applied to both img and emoji wrapper */
  style?: React.CSSProperties
}

/**
 * Renders an item's visual: an <img> when `def.icon` is set, otherwise the emoji.
 */
const ItemIcon: React.FC<ItemIconProps> = ({ def, fontSize = 26, opacity = 1, filter, style }) => {
  if (def.icon) {
    // Only allow safe URL schemes to prevent XSS via javascript: or data: URIs
    const isSafeUrl = /^(https?:\/\/|\/|\.\/)/.test(def.icon)
    if (isSafeUrl) {
      return (
        <img
          src={def.icon}
          alt={def.name}
          draggable={false}
          style={{
            // 60% of cell size keeps the image comfortably inside the cell padding
            width: '60%',
            height: '60%',
            objectFit: 'contain',
            opacity,
            filter,
            pointerEvents: 'none',
            ...style,
          }}
        />
      )
    }
  }
  return (
    <span
      style={{
        fontSize,
        lineHeight: 1,
        opacity,
        filter,
        ...style,
      }}
    >
      {def.emoji}
    </span>
  )
}

export default ItemIcon
