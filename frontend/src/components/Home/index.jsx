import { Component } from "react";
import './index.css';
import { MdOutlineMail } from "react-icons/md";
import { IoIosCall } from "react-icons/io";
import { CiGlobe, CiLocationOn } from "react-icons/ci";
import { GoOrganization } from "react-icons/go";
import { Button, Spin } from "antd";

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

class Home extends Component {
  state = { 
    data: [], 
    apiStatus: apiStatusConstants.initial,
    isPopupOpen: false,
    editingUser: null,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ apiStatus: apiStatusConstants.inProgress });

    const apiUrl = `https://jsonplaceholder.typicode.com/users`;
    const options = { method: 'GET' };
    const response = await fetch(apiUrl, options);

    if (response.ok) {
      const fetchedData = await response.json();
      this.setState({
        data: fetchedData,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ apiStatus: apiStatusConstants.failure });
    }
  };

  getAvatarUrl = (username) => {
    return `https://api.dicebear.com/6.x/avataaars/svg?seed=${encodeURIComponent(username)}&mouth[]=smile`;
  };

  openPopup = (user) => {
    this.setState({ isPopupOpen: true, editingUser: { ...user } });
  };

  closePopup = () => {
    this.setState({ isPopupOpen: false, editingUser: null });
  };

  handleChange = (e) => {
    const { editingUser } = this.state;
    this.setState({
      editingUser: {
        ...editingUser,
        [e.target.name]: e.target.value,
      }
    });
  };

  saveUser = () => {
    const { data, editingUser } = this.state;
    const updatedData = data.map((user) =>
      user.id === editingUser.id ? editingUser : user
    );
    this.setState({ data: updatedData, isPopupOpen: false, editingUser: null });
  };

  renderPopup = () => {
    const { editingUser } = this.state;
    if (!editingUser) return null;

    return (
      <div className="popup-overlay">
        <div className="popup">
          <h2>Edit Profile</h2>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={editingUser.name} 
            onChange={this.handleChange} 
          />
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            value={editingUser.username} 
            onChange={this.handleChange} 
          />
          <label>Email:</label>
          <input 
            type="text" 
            name="email" 
            value={editingUser.email} 
            onChange={this.handleChange} 
          />
          <label>Phone:</label>
          <input 
            type="text" 
            name="phone" 
            value={editingUser.phone} 
            onChange={this.handleChange} 
          />
          <div className="popup-buttons">
            <Button type="primary" onClick={this.saveUser}>Save</Button>
            <Button onClick={this.closePopup}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  };

  renderUsers = () => {
    const { data } = this.state;
    return (
      <div className="user-cont">
        {data.map((each) => (
          <div className="user-card" key={each.id}>
            <div className="avatar-wrapper">
              <img
                src={this.getAvatarUrl(each.username)}
                className="user-img"
                alt={`${each.username}'s avatar`}
              />
            </div>
            
            <h1 className="name">{each.name}</h1>
            <p className="username">@{each.username}</p>

            <div className="sec-co">
              <div className="rw-co">
                <MdOutlineMail />
                <p className="username">{each.email}</p>
              </div>

              <div className="rw-co">
                <IoIosCall />
                <p className="username">{each.phone}</p>
              </div>

              <div className="rw-co">
                <CiGlobe />
                <p className="username">{each.website}</p>
              </div>

              <div className="rw-co">
                <GoOrganization />
                <p className="username">{each.company.name}</p>
              </div>

              <div className="rw-c">
                <CiLocationOn />
                <div>
                  <p className="username">{each.address.suite}</p>
                  <p className="username">{each.address.city}</p>
                </div>
              </div>
            </div>

            <Button className="butn" onClick={() => this.openPopup(each)}>Edit Profile</Button>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { apiStatus } = this.state;

    if (apiStatus === apiStatusConstants.inProgress) {
      return (
        <div className="spinner">
          <Spin size="large" tip="Loading Users..." />
        </div>
      );
    }

    if (apiStatus === apiStatusConstants.failure) {
      return <h2 className="error-msg">Failed to load data. Please try again.</h2>;
    }

    return (
      <div>
        {this.renderUsers()}
        {this.renderPopup()}
      </div>
    );
  }
}

export default Home;
