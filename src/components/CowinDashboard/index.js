// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok === true) {
      const fetchedData = await response.json()
      //   console.log(fetchedData)
      const updatedData = {
        Last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachData => ({
            VaccineDate: eachData.vaccine_date,
            dose1: eachData.dose_1,
            dose2: eachData.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachData => ({
          age: eachData.age,
          count: eachData.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(
          eachData => ({
            count: eachData.count,
            gender: eachData.gender,
          }),
        ),
      }
      //   console.log(updatedData)
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loading-view" testid="loader">
      <Loader color="#ffffff" height={80} type="ThreeDots" width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {vaccinationData} = this.state
    return (
      <div>
        <VaccinationCoverage
          VaccinationCoverageDetails={vaccinationData.Last7DaysVaccination}
        />
        <VaccinationByGender
          VaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />
        <VaccinationByAge
          VaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </div>
    )
  }

  renderVaccinationDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-container">
          <div className="website-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo"
            />
            <h1 className="website-name">Co-WIN</h1>
          </div>
          <h1 className="tag-line">CoWIN Vaccination in India</h1>
          {this.renderVaccinationDetails()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
