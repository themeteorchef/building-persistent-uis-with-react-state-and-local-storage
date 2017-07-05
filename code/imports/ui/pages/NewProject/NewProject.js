/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import store from 'store';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import Icon from '../../components/Icon/Icon';

import './AddCard.scss';

class AddCard extends React.Component {
  constructor(props) {
    super(props);
    const existingProjects = store.get('pup_projects_example');
    this.state = {
      projects: existingProjects.length > 0 ? existingProjects : [{
        _id: Random.id(),
        active: true,
        image: this.getRandomImage(),
        title: '',
        description: '',
      }],
    };

    this.setActiveProject = this.setActiveProject.bind(this);
    this.setProjectOnState = this.setProjectOnState.bind(this);
    this.handleDeleteProject = this.handleDeleteProject.bind(this);
    this.handleAddProject = this.handleAddProject.bind(this);
    this.renderProjectsList = this.renderProjectsList.bind(this)
  }

  getRandomImage() {
    const urls = [
      'https://tmc-post-content.s3.amazonaws.com/2017-07-04T14:23:38-05:00_test-image-yellow.png',
      'https://tmc-post-content.s3.amazonaws.com/2017-07-04T14:23:44-05:00_test-image-green.png',
      'https://tmc-post-content.s3.amazonaws.com/2017-07-04T14:23:59-05:00_test-image-purple.png',
      'https://tmc-post-content.s3.amazonaws.com/2017-07-04T14:24:05-05:00_test-image-blue.png',
      'https://tmc-post-content.s3.amazonaws.com/2017-07-04T14:24:27-05:00_test-image-red.png',
    ];

    return urls[Math.floor(Math.random() * urls.length)];
  }

  setActiveProject(event, _id) {
    const existingProjects = this.state.projects.map((project) => {
      project.active = false; // eslint-disable-line
      return project;
    });
    const projectToUpdate = _.findWhere(existingProjects, { _id });
    projectToUpdate.active = true;

    this.setState({ projects: existingProjects }, () => {
      store.set('pup_projects_example', existingProjects);
    });
  }

  setProjectOnState(event, _id) {
    const existingProjects = this.state.projects;
    const projectToUpdate = _.findWhere(existingProjects, { _id });
    projectToUpdate[event.target.name] = event.target.value;
    this.setState({ projects: existingProjects }, () => {
      store.set('pup_projects_example', existingProjects);
    });
  }

  handleDeleteProject(event, _id) {
    const existingProjects = _.reject(this.state.projects.map((project, index) => {
      project.active = index === 0 ? true : false; // eslint-disable-line
      return project;
    }), project => project._id === _id);

    if ((existingProjects.length - 1) === 0) this.handleAddProject();

    this.setState({ projects: existingProjects }, () => {
      store.set('pup_projects_example', existingProjects);
    });
  }

  handleAddProject() {
    const existingProjects = this.state.projects.map((project) => {
      project.active = false; // eslint-disable-line
      return project;
    });

    existingProjects.push({
      _id: Random.id(),
      active: true,
      image: this.getRandomImage(),
      title: '',
      description: '',
    });

    this.setState({ projects: existingProjects }, () => {
      store.set('pup_projects_example', existingProjects);
    });
  }

  renderProjectsList() {
    return (<ul className="ProjectsList">
      {this.state.projects.map(({ active, image, _id }) => (
        <li key={_id} className={`Project ${active ? 'active' : ''}`}>
          <Icon icon="remove" onClick={event => this.handleDeleteProject(event, _id)} />
          <span className="ProjectLink" onClick={event => this.setActiveProject(event, _id)} />
          <img src={image} alt="Project Title" />
        </li>
      ))}
      <li className="AddProject-button" onClick={this.handleAddProject}>
        <p><Icon icon="plus" /> Add Project</p>
      </li>
    </ul>);
  }

  render() {
    return (<div className="AddCard">
      <Row>
        <Col xs={12} sm={10} smOffset={1}>
          <h4 className="page-header">Add Projects</h4>
          <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
            <Row>
              <Col xs={12} sm={10}>
                <Row>
                  {this.state.projects.map(({ _id, active, image, title, description }) => (
                    active ? (<div key={_id} className="EditProject">
                      <Col xs={12} sm={4}>
                        <div className="EditProject-image">
                          <img src={image} alt={title} />
                        </div>
                      </Col>
                      <Col xs={12} sm={8}>
                        <FormGroup>
                          <ControlLabel>Title</ControlLabel>
                          <input
                            className="form-control"
                            type="text"
                            name="title"
                            value={title}
                            onChange={event => this.setProjectOnState(event, _id)}
                          />
                        </FormGroup>
                        <FormGroup>
                          <ControlLabel>Description</ControlLabel>
                          <textarea
                            className="form-control"
                            name="description"
                            value={description}
                            onChange={event => this.setProjectOnState(event, _id)}
                          />
                        </FormGroup>
                      </Col>
                    </div>) : ''
                  ))}
                </Row>
              </Col>
              <Col xs={12} sm={2}>
                {this.renderProjectsList()}
              </Col>
            </Row>
          </form>
        </Col>
      </Row>
    </div>);
  }
}

AddCard.propTypes = {
  // prop: PropTypes.string.isRequired,
};

export default AddCard;
