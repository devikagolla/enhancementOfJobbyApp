import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'

import SimilarJobs from '../SimilarJobs'
import SkillsCard from '../SkillsCard'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemData()
  }

  getJobItemData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = [fetchedData.job_details].map(job => ({
        title: job.title,
        packagePerAnnum: job.package_per_annum,
        location: job.location,
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        companyWebsiteUrl: job.company_website_url,
        jobDescription: job.job_description,
        rating: job.rating,
        employmentType: job.employment_type,
        lifeAtCompany: {
          description: job.life_at_company.description,
          imageUrl: job.life_at_company.image_url,
        },
        skills: job.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
      }))

      const updatedSimilarData = fetchedData.similar_jobs.map(job => ({
        title: job.title,
        packagePerAnnum: job.package_per_annum,
        location: job.location,
        id: job.id,
        companyLogoUrl: job.company_logo_url,
        jobDescription: job.job_description,
        rating: job.rating,
        employmentType: job.employment_type,
      }))
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItem = () => {
    const {jobData, similarJobsData} = this.state
    if (jobData.length >= 1) {
      const {
        title,
        packagePerAnnum,
        companyLogoUrl,
        jobDescription,
        rating,
        location,
        employmentType,
        lifeAtCompany,
        companyWebsiteUrl,
        skills,
      } = jobData[0]
      const {description, imageUrl} = lifeAtCompany
      return (
        <div>
          <div>
            <img
              src={companyLogoUrl}
              alt='job details company logo'
              className='thumbnail'
            />
            <div>
              <h1 className='title'>{title}</h1>
              <div>
                <BsStarFill />
                <p className='brand'>{rating}</p>
              </div>
            </div>
          </div>
          <div className='product-details'>
            <div>
              <MdLocationOn />
              <p className='price'>{location}</p>
            </div>
            <div>
              <BsFillBriefcaseFill />
              <p className='rating'>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <h1>Description</h1>
            <div>
              <a href={companyWebsiteUrl}>Visit</a>
              <BiLinkExternal />
            </div>
            <p>{jobDescription}</p>
          </div>
          <ul>
            <h1>Skills</h1>
            {skills.map(each => (
              <SkillsCard skillDetails={each} key={each.name} />
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div>
            <p>{description}</p>
            <img src={imageUrl} alt='Life at company' />
          </div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobsData.map(each => (
              <SimilarJobs jobDetails={each} key={each.id} />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  renderFailureView = () => (
    <div>
      <img
        src='https://assets.ccbp.in/frontend/react-js/failure-img.png '
        alt='failure view'
        className='register-prime-image'
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type='button' onClick={this.getJobItemData}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className='products-loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
    </div>
  )

  renderJob = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItem()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className='blog-container'>{this.renderJob()}</div>
      </>
    )
  }
}

export default JobItemDetails
