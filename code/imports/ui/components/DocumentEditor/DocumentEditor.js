/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import store from 'store';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';
import Icon from '../Icon/Icon';

import './DocumentEditor.scss';

class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    const { doc } = props;
    const docInLocalStorage = store.get('pup_document');
    const persistedDoc = doc || docInLocalStorage;

    this.state = persistedDoc || {
      title: '',
      body: '',
      topics: [],
    };

    this.setDocumentOnState = this.setDocumentOnState.bind(this);
    this.setTopicOnState = this.setTopicOnState.bind(this);
    this.deleteTopic = this.deleteTopic.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setDocumentOnState(event) {
    const doc = this.state;
    doc[event.target.name] = event.target.value;
    this.setState(doc, () => store.set('pup_document', doc));
  }

  setTopicOnState(event) {
    event.persist();
    if (event.keyCode === 13) {
      const doc = this.state;
      doc.topics.push({ _id: Random.id(), label: event.target.value });
      this.setState(doc, () => {
        store.set('pup_document', doc);
        event.target.value = ''; // eslint-disable-line
      });
    }
  }

  deleteTopic(event, _id) {
    const doc = this.state;
    doc.topics = _.reject(doc.topics, topic => topic._id === _id);
    this.setState(doc, () => store.set('pup_document', doc));
  }

  handleSubmit() {
    const { history } = this.props;
    const { title, body, topics } = this.state;
    const existingDocument = this.state && this.state._id;
    const methodToCall = existingDocument ? 'documents.update' : 'documents.insert';
    const doc = {
      title: title.trim(),
      body: body.trim(),
      topics,
    };

    if (existingDocument) doc._id = existingDocument;

    Meteor.call(methodToCall, doc, (error, documentId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingDocument ? 'Document updated!' : 'Document added!';
        this.form.reset();
        store.remove('pup_document');
        Bert.alert(confirmation, 'success');
        history.push(`/documents/${documentId}`);
      }
    });
  }

  render() {
    const { title, body, topics } = this.state;
    return (<form ref={form => (this.form = form)} onSubmit={(event) => event.preventDefault()}>
      <FormGroup>
        <ControlLabel>Title</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="title"
          value={title}
          onChange={this.setDocumentOnState}
          placeholder="Oh, The Places You'll Go!"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Body</ControlLabel>
        <textarea
          className="form-control"
          name="body"
          value={body}
          onChange={this.setDocumentOnState}
          placeholder="Congratulations! Today is your day. You're off to Great Places! You're off and away!"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Topics</ControlLabel>
        <input
          type="text"
          className="form-control"
          name="topic"
          onKeyUp={this.setTopicOnState}
          placeholder="Type a topic and press enter to add..."
        />
        <div className="TopicsList clearfix">
          {topics.length > 0 ? <div>
            {topics.map(({ _id, label }) => (
              <div key={_id} className="Topic">
                {label}
                <Icon icon="remove" onClick={event => this.deleteTopic(event, _id)} />
              </div>),
            )}
          </div> : <p>Topics you add above will appear here.</p>}
        </div>
      </FormGroup>
      <Button type="button" bsStyle="success" onClick={this.handleSubmit}>
        {this.state && this.state._id ? 'Save Changes' : 'Add Document'}
      </Button>
    </form>);
  }
}

DocumentEditor.defaultProps = {
  doc: null,
};

DocumentEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default DocumentEditor;
