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
  const [calculatedFromSharePercent, setCalculatedFromSharePercent] = useState<String>(stylizeNumber(parseFloat(((Number(_roleData.share_percent) / 100) * Number(price)).toFixed(2))))

  useEffect(() => {
    setCalculatedFromSharePercent(stylizeNumber(parseFloat(((Number(_roleData.share_percent) / 100) * Number(price)).toFixed(2))))
  }, [_roleData.share_percent])
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
      updateValue["share_value"] = parseFloat(
        ((Number(price) / 100) * Number(value)).toFixed(3)
      )
    }
    if (key == "share_value") {
      updateValue[key] = Number(parseFloat(value.replace(",", "")).toFixed(2))
      updateValue["share_percent"] = parseFloat(
        ((Number(value) / Number(price)) * 100).toFixed(3)
      )
    }

    updateValue[key] = Number(value)
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
          type="number"
          label="Share(%)"
          defaultValue={5}
          value={_roleData.share_percent ? Number(_roleData.share_percent) : parseFloat(((Number(_roleData.share_value) / Number(price)) * 100).toFixed(3))}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChangeNumber(e, "share_percent")
          }
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          size="small"
          type="string"
          label="Share($)"
          value={_roleData.share_value ? stylizeNumber(_roleData.share_value) : calculatedFromSharePercent}
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
