import React from "@libs/react"
import useApp from "../../../../hooks/useApp"
import { IGCIInfoItemProps, IRoleData } from "../../../../models/type"
import { stylizeNumber } from "../../../../util"

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  saveData: { updateFlag },
  totalClc,
  price,
  index,
  role,
  updateData,
}) => {
  const { useState, useEffect } = React
  const { submitted } = useApp()
  const [_roleData, _setRoleData] = useState<IRoleData>(role)
  const [sharePercent, setSharePercent] = useState<string>('')
  const [shareValue, setShareValue] = useState<string>('')

  useEffect(() => {
    if(_roleData.share_percent) {
      let updateSharePercent = stylizeNumber(_roleData.share_percent)
      setSharePercent(updateSharePercent)
    } else {
      let updateSharePercent = stylizeNumber(parseFloat(((Number(_roleData.share_value) / Number(price)) * 100).toFixed(2)))
      setSharePercent(updateSharePercent)
    }
  }, [])

  useEffect(() => {
    if (_roleData.share_value) {
      let udpateShareValue = stylizeNumber(_roleData.share_value)
      setShareValue(udpateShareValue)
    } else {
      let udpateShareValue = stylizeNumber(parseFloat(((Number(_roleData.share_percent) / 100) * Number(price)).toFixed(2)))
      setShareValue(udpateShareValue)
    }
  }, [])

  const sharePercentEvent = document.getElementById(`share-percent${role.role_id}`)
  sharePercentEvent?.addEventListener('focusout', () => {
    let displayValue = stylizeNumber(parseFloat(sharePercent))
    setSharePercent(displayValue)
  })
  const shareValueEvent = document.getElementById(`share-value${role.role_id}`)
  shareValueEvent?.addEventListener('focusout', () => {
    let displayValue = stylizeNumber(parseFloat(parseFloat(String(Number(shareValue.replace(/\,/g,'')))).toFixed(2)))
    setShareValue(displayValue)
  })

  const handleChangeNumber = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    let value: string = parseFloat(String(Number(e.target.value.replace(/\,/g,'')))).toFixed(2)
    if (Number(value) + "" === "NaN" || (value + "").length > 16) {
      return
    }
    if (key == "share_percent" && Number(value) > 100) {
      return
    }
    if (submitted !== 1)
      updateFlag(true)
    let updateValue: IRoleData = JSON.parse(JSON.stringify(_roleData))

    if (key == "share_percent") {
      setSharePercent(e.target.value)
      updateValue[key] = Number(value)
      let updateShareValue = parseFloat(
        ((Number(price) / 100) * Number(value)).toFixed(2)
      )
      updateValue["share_value"] = updateShareValue
      setShareValue(stylizeNumber(updateShareValue))
    } else if (key == "share_value") {
      setShareValue(e.target.value)
      updateValue[key] = Number(parseFloat(value.replace(",", "")).toFixed(2))
      let updatePercentValue = parseFloat(
        ((Number(value) / Number(price)) * 100).toFixed(2)
      )
      updateValue['share_percent'] = updatePercentValue
      setSharePercent(stylizeNumber(updatePercentValue))
    } else {
      updateValue[key] = e.target.value
    }
    updateData(updateValue)
    _setRoleData(updateValue)
    totalClc(index, updateValue, true)
  }

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof IRoleData
  ) => {
    let value: string = e.target.value
    let updateValue = JSON.parse(JSON.stringify(_roleData))
    updateValue[key] = value
    _setRoleData(updateValue)
    totalClc(index, updateValue, false)
  }

  return (
    <Grid container spacing={2} style={{ paddingTop: 10, paddingBottom: 10 }}>
      <Grid item xs={4}>
        <Box>
          <label style={{ fontSize: 13, marginTop: 11 }}>
            {_roleData.legal_full_name}
          </label>
        </Box>
        <Box>
          <label style={{ fontSize: 13, color: "#ababab" }}>
            {_roleData.role}
          </label>
        </Box>
      </Grid>
      <Grid item xs={4}>
        <TextField
          size="small"
          label="Share(%)"
          id={`share-percent${role.role_id}`}
          defaultValue={5}
          value={sharePercent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeNumber(e, "share_percent")
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          size="small"
          label="Share($)"
          id={`share-value${role.role_id}`}
          value={shareValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeNumber(e, "share_value")
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4} style={{ marginTop: -10 }} />
      <Grid item xs={8} style={{ marginTop: -10 }}>
        <TextField
          type="text"
          label="Note"
          value={_roleData.note}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeText(e, "note")
          }
          style={{ width: "100%", marginTop: -15 }}
        />
      </Grid>
    </Grid>
  )
}

export default GCIInfoItem
