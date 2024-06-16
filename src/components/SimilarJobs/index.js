import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    title,
    id,
    companyLogoUrl,
    jobDescription,
    rating,
    location,
    employmentType,
  } = jobDetails
  return (
    <li key={id}>
      <div>
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="thumbnail"
        />
        <div>
          <h1 className="title">{title}</h1>
          <div>
            <BsStarFill />
            <p className="brand">{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
      <div className="product-details">
        <div>
          <MdLocationOn />
          <p className="price">{location}</p>
        </div>
        <div>
          <BsFillBriefcaseFill />
          <p className="rating">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobs
