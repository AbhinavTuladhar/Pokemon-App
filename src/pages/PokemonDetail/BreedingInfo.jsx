import { React } from 'react'
import { AnimatedTableRowContainer } from '../../components/AnimatedContainers'
import SectionTitle from '../../components/SectionTitle'
import TableContainer from '../../components/TableContainer'
import formatName from '../../utils/NameFormatting'

const generateGenderInfo = genderRate => {
  // The gender_rate is a value showing how many out of 8 pokemon are female.
  // -1 means genderless.
  if (genderRate === -1)
    return ['Genderless']
  let femaleRatio = ((genderRate / 8) * 100).toFixed(2)
  let maleRatio = (100 - femaleRatio).toFixed(2)
  return [`${maleRatio}% male`, `${femaleRatio}% female`]
}

const BreedingInfo = ({ data }) => {
  if (!data) return

  const { egg_groups, gender_rate, hatch_counter } = data

  // List the egg groups
  const eggGroupList = egg_groups?.map(group => formatName(group.name)).join(', ')

  // For the gender.
  const [maleRatio, femaleRatio] = generateGenderInfo(gender_rate)
  const genderRow = (
    <>
      <span className={maleRatio !== 'Genderless' ? 'text-blue-500': ''}>
        {maleRatio}
      </span>
      {
        femaleRatio &&
        <>
          ,&nbsp;
          <span className='text-pink-400'>
          {femaleRatio}
        </span>
        </>
      }
    </>
  )

  // For the egg cycles
  const maxStepsRequired = 257 * hatch_counter
  const minStepsRequired = Math.ceil(maxStepsRequired * 0.95)
  const eggCycleRow = `${hatch_counter} (${minStepsRequired} - ${maxStepsRequired} steps)`

  // Now build the table rows
  const tableRows = [
    { label: 'Egg Groups', value: eggGroupList },
    { label: 'Gender Rate', value: genderRow },
    { label: 'Egg Cycles', value: eggCycleRow }
  ]

  const tableDiv = tableRows.map(row => {
    return (
      <AnimatedTableRowContainer className='table-row py-2 h-12' useOnce>
        <div className='table-cell border-t-[1px] border-gray-200 align-middle w-4/12 text-right'> {row.label} </div>
        <div className='table-cell border-t-[1px] border-gray-200 align-middle pl-4 w-8/12 items-center'> {row.value} </div>
      </AnimatedTableRowContainer>
    )
  })

  return (
    <>
      <SectionTitle text={'Breeding'} />
      <TableContainer child={tableDiv} />
    </>
  )

}

export default BreedingInfo