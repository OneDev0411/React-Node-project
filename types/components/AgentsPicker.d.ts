declare interface AgentsPickerProps {
  useTeamBrandId: boolean
  isPrimaryAgent: boolean
  flattenTeams: boolean
  onSelectAgent: (agent: BrandedUser) => void
}
