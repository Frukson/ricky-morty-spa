import { Text } from '@chakra-ui/react'
import React from 'react'

interface DetailRowProps {
  label: string
  value: React.ReactNode
  boldLabel?: boolean
  color?: string
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  boldLabel = true,
  color = 'cyan.300',
}) => {
  if (!value) {
    return null
  }

  return (
    <Text fontSize={`lg`}>
      <Text
        as={`span`}
        fontWeight={boldLabel ? `bold` : `normal`}
        color={color}
      >
        {`${label}: `}
      </Text>
      {value}
    </Text>
  )
}

export default DetailRow
