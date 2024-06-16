import {Link} from 'react-router-dom'
import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

const JobCard = props => {
  const {jobData} = props
  const {
    title,
    packagePerAnnum,
    location,
    id,
    companyLogoUrl,
    jobDescription,
    rating,
    employmentType,
  } = jobData

  return (
    <li className="product-item">
      <Link to={`/jobs/${id}`}>
        <div>
          <img
            src={companyLogoUrl}
            alt="job details company logo"
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
        <div className="product-details">
          <div>
            <MdLocationOn />
            <p className="price">{location}</p>
          </div>
          <p className="rating">{employmentType}</p>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}
export default JobCard
