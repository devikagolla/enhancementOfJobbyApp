import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobCard from '../JobCard'
import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileDetails: {},
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiStatusConstants.initial,
    employeeTypeList: [],
    minimumSalary: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const profile = fetchedData.profile_details
      const updatedData = {
        name: profile.name,
        profileImageUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    this.setState({
      apiJobStatus: apiStatusConstants.inProgress,
    })
    const {employeeTypeList, minimumSalary, searchInput} = this.state
    const employeetype = employeeTypeList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeetype}&minimum_package=${minimumSalary}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
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
        jobsList: updatedData,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobStatus: apiStatusConstants.failure,
      })
    }
  }

  changeEmployee = event => {
    const {employeeTypeList} = this.state
    if (employeeTypeList.includes(event.target.id)) {
      const updateList = employeeTypeList.filter(
        each => each !== event.target.id,
      )
      this.setState({employeeTypeList: updateList}, this.getJobs)
    } else {
      this.setState(
        prev => ({
          employeeTypeList: [...prev.employeeTypeList, event.target.id],
        }),
        this.getJobs,
      )
    }
  }

  onChangeSalary = event => {
    this.setState({minimumSalary: event.target.id}, this.getJobs)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  submitSearch = () => {
    this.getJobs()
  }

  renderSearchInput = () => {
    const {searchInput} = this.state

    return (
      <div>
        <input
          value={searchInput}
          type="search"
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
          placeholder="Search"
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.submitSearch}
        >
          <BsSearch />
        </button>
      </div>
    )
  }

  renderEmployeeType = () => (
    <div>
      <h1>Type of Employment</h1>
      <ul>
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId}>
            <input
              type="checkbox"
              value={each.employmentTypeId}
              id={each.employmentTypeId}
              onChange={this.changeEmployee}
            />
            <label htmlFor={each.employmentTypeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRange = () => (
    <div>
      <h1>Salary Range</h1>
      <ul>
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId}>
            <input
              type="radio"
              name="salary"
              id={each.salaryRangeId}
              onChange={this.onChangeSalary}
            />
            <label htmlFor={each.salaryRangeId}>{each.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div>
      <h1>profile Fail</h1>
      <button type="button" data-testid="button" onClick={this.getProfile}>
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    return jobsList.length > 0 ? (
      <div>
        <ul className="products-list">
          {jobsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="register-prime-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" data-testid="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetails()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderAllJobs = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
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
        <div>
          <div>
            <div>
              {this.renderSearchInput()}
              {this.renderProfile()}
              <hr />
              {this.renderEmployeeType()}
              <hr />
              {this.renderSalaryRange()}
            </div>
          </div>
          <div>{this.renderSearchInput()}</div>
          {this.renderAllJobs()}
        </div>
      </>
    )
  }
}

export default Jobs
