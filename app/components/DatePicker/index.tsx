import Ui from '@libs/material-ui'
import React from '@libs/react'

interface Props {
  Picker: CoreComponents['DatePicker']
}

export function DatePicker({ Picker }: Props) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  return (
    <div style={{ width: '100%' }}>
      <Ui.TextField
        InputProps={{
          endAdornment: (
            <Ui.Button size="small" onClick={(e: any) => setAnchorEl(e.currentTarget)}>
              Date
            </Ui.Button>
          )
        }}
      />

      <Ui.Popover
        id={anchorEl ? 'date-picker-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Picker onChange={date => console.log(date)} />
      </Ui.Popover>
    </div>
  )
}
