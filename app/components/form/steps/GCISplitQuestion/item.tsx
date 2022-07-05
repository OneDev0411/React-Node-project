import React from '@libs/react'
import useApp from '../../../../hooks/useApp';
import { AgentData, IGCIInfoItemProps } from "../../../../models/type";

const GCIInfoItem: React.FC<IGCIInfoItemProps> = ({
  Ui: { Grid, Box, TextField },
  role,
  GCIValue,
  index,
}) => {
  const { useState, useEffect } = React;
  const { agentDataList, setAgentDataList } = useApp();
  const agentData: AgentData = agentDataList[index];

  const [note, setNote] = useState<string>("");

  useEffect(() => {
    // save note data when the text field loses focus
    let noteTextField = document.getElementById(`GCI-item-textfield-${index}`);
    noteTextField?.addEventListener('focusout', function handler(e) {
      let _agentDataList = agentDataList.slice();
      _agentDataList[index].note = note;
      if(setAgentDataList !== undefined) {
        setAgentDataList(_agentDataList);
      }
    });
  }, []);

  const handleChangeSharePercent = (value: Number) => {
    if(value > 100)
      return;
    let _agentDataList = agentDataList.slice();
    _agentDataList[index].sharePercent = value;
    if(setAgentDataList !== undefined) {
      setAgentDataList(_agentDataList);
    }
  }

  const handleChangeNote = (event: any) => {
    setNote(event.target.value);
  }

  return (
    <Grid container spacing={2} style={{ paddingBottom: 10 }}>
      <Grid item xs={4}>
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
      <Grid item xs={4}>
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
      <Grid item xs={4}>
        <TextField
          required
          size='small'
          label="Share($)"
          value={parseFloat((Number(GCIValue) / 100 * Number(agentData.sharePercent)).toFixed(3))}
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item xs={4} style={{ marginTop: -10 }} />
      <Grid item xs={8} style={{ marginTop: -10 }}>
        <TextField
          id={`GCI-item-textfield-${index}`}
          size='small'
          label="Note"
          value={note}
          onChange={handleChangeNote}
          style={{ width: '100%', marginTop: -15, marginBottom: 20 }}
        />
      </Grid>
    </Grid>
  );
}

export default GCIInfoItem;