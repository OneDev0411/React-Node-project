import React from '@libs/react'
import Ui from '@libs/material-ui'
import { IContactCardProps, IDropdownSelectProps } from '../models/type'
import { defaultRole } from '../util'

const mockupContactList: IDealRole[] = [
  {
    ...defaultRole,
    legal_first_name: "Eli",
    legal_last_name: "Eric",
    legal_full_name: "Eli Eric",
    role: "Title",
    phone_number: "1-604-245-2452",
    email: "aedmond@gmail.com",
  },
  {
    ...defaultRole,
    legal_first_name: "Eli",
    legal_last_name: "Eric and Caprice Doe (Partner/Spouse)",
    legal_full_name: "Eli Eric and Caprice Doe (Partner/Spouse)",
    role: "Title",
    phone_number: "1-604-245-2452",
    email: "aedmond@gmail.com",
  },
  {
    ...defaultRole,
    legal_first_name: "Elissa",
    legal_last_name: "Rich",
    legal_full_name: "Elissa Rich",
    role: "Title",
    phone_number: "1-604-245-2452",
    email: "aedmond@gmail.com"
  },
  {
    ...defaultRole,
    legal_first_name: "Eli",
    legal_last_name: "Seay",
    legal_full_name: "Eli Seay",
    role: "Title",
    phone_number: "1-604-245-2452",
    email: "aedmond@gmail.com"
  },
  {
    ...defaultRole,
    legal_first_name: "Elina",
    legal_last_name: "Beckham",
    legal_full_name: "Elina Beckham",
    role: "Title",
    phone_number: "1-604-245-2452",
    email: "aedmond@gmail.com"
  },
]

const ContactCard: React.FC<IContactCardProps> = ({
  contactData,
  onClickCard,
  index,
}) => {
  const { Grid, Avatar, Box } = Ui;

  return (
    <Box style={{ width: '100%', marginTop: -5, cursor: 'pointer' }} onClick={() => onClickCard(index)}>
      <Grid container style={{ marginBottom: 10, marginRight: 10, marginLeft: 10, float: 'right', maxWidth: 600, border: 'solid 1px #dbdbdb', borderRadius: 5, paddingTop: 5, paddingBottom: 5 }} className="UserInfo-Card">
        <Grid item xs={2} style={{ maxWidth: 77 }}>
          <Avatar alt="Remy Sharp" src={""} style={{ paddingTop: '0px !important', width: '70%', height: '88%', marginLeft: 12, marginTop: 4 }} />
        </Grid>
        <Grid item xs={10}>
          <Grid container>
            <label style={{ cursor: 'pointer' }}>
              <strong>
                {contactData.legal_full_name}
              </strong>
            </label>
          </Grid>
          <Grid container>
            <label style={{ color: '#949598', fontWeight: 300, cursor: 'pointer' }}>
              {contactData.phone_number}
            </label>
            <label style={{ marginLeft: 20, color: '#949598', fontWeight: 300, cursor: 'pointer' }}>
              {contactData.email}
            </label>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

const DropdownSelect: React.FC<IDropdownSelectProps> = ({
  onSelect,
  onInsert,
  roleType,
}) => {
  const { useState } = React;
  const { Grid, FormControl, InputLabel, Select, Box, TextField } = Ui;

  const [selectValue, setSelectValue] = useState<number>(-1);
  const [filterText, setFilterText] = useState<string>("");

  const handleChangeInput = (event: any) => {
    setFilterText(event.target.value);
  }

  const filteredContactList = mockupContactList.filter((contactData: IDealRole) => contactData.legal_full_name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) === 0);

  return (
    <Grid item xs={12}>
      <Grid container spacing={2} style={{ paddingBottom: 30 }}>
        <Grid item xs={4} />
        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label" placeholder={`Enter ${roleType.toLocaleLowerCase()}'s name`} style={{ marginBottom: 10 }}>
              Role
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectValue}
              label="Seller"
              MenuProps={{ autoFocus: false }}
            >
              <TextField
                autoFocus
                value={filterText}
                style={{ width: '100%', paddingLeft: 15, paddingRight: 15, marginBottom: 15 }}
                onChange={handleChangeInput}
                placeholder={`Enter ${roleType.toLocaleLowerCase()}'s name`}
              />

              {filteredContactList.map((contactData: IDealRole, index: number) =>
                <ContactCard
                  contactData={contactData}
                  key={index}
                  index={index}
                  onClickCard={(index: number) => { console.log('234234234234'); onSelect(filteredContactList[index])}}
                />
              )}
              {filteredContactList.length === 0 && (
                <label className="pointable" style={{ float: 'left', color: '#0fb78d', fontWeight: 300, paddingLeft: 15, paddingTop: 5, paddingBottom: 5 }} onClick={() => onInsert(filterText)}>
                  + Create New Contract: <strong>'{filterText}'</strong>
                </label>
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default DropdownSelect;