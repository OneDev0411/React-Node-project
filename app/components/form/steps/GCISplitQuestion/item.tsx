import React from '@libs/react'
import useApp from '../../../../hooks/useApp';
import { AgentData, IGCIInfoItemProps } from "../../../../models/type";

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  role,
  GCIValue,
  index,
}) => {
  const { useState } = React;
  const { agentDataList, setAgentDataList } = useApp();
  const agentData: AgentData = agentDataList[index];

  const handleChangeSharePercent = (value: Number) => {
    if(value > 100)
      return;
    let _agentDataList = agentDataList.slice();
    _agentDataList[index].sharePercent = value;
    if(setAgentDataList !== undefined) {
      setAgentDataList(_agentDataList);
    }
  }

  return (
    <Grid container spacing={2} style={{ paddingBottom: 10 }}>
      <Grid item xs={6}>
        <Box>
          <label style={{ fontSize: 13, marginTop: 11 }}>
            {role.legal_full_name}
          </label>
        </Box>
        <Box>
          <label style={{ fontSize: 13, color: '#ababab' }}>
            {role.role}
          </label>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <TextField
          required
          size='small'
          label="Share(%)"
          defaultValue={5}
          value={agentData.sharePercent}
          onChange={(e: any) => handleChangeSharePercent(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          required
          size='small'
          label="Share($)"
          value={Number(GCIValue) / 100 * Number(agentData.sharePercent)}
          style={{ width: '100%' }}
        />
      </Grid>
    </Grid>
  );
}

export default GCIInfoItem;