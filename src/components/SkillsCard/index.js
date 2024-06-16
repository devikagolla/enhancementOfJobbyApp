const SkillsCard = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails

  return (
    <li key={name}>
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}
export default SkillsCard
