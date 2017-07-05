import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import ProjectsCollection from '../../../api/Projects/Projects';
import Loading from '../../components/Loading/Loading';

import './Projects.scss';

const Projects = ({ loading, projects, match, history }) => (!loading ? (
  <div className="Projects">
    <div className="page-header clearfix">
      <h4 className="pull-left">Projects</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Project</Link>
    </div>
    {projects.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Last Updated</th>
          <th>Created</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {projects.map(({ _id, title, createdAt, updatedAt }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>{timeago(updatedAt)}</td>
            <td>{monthDayYearAtTime(createdAt)}</td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${_id}`)}
                block
              >Edit</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No projects yet!</Alert>}
  </div>
) : <Loading />);

Projects.propTypes = {
  loading: PropTypes.bool.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('projects');
  return {
    loading: !subscription.ready(),
    projects: ProjectsCollection.find().fetch(),
  };
}, Projects);
