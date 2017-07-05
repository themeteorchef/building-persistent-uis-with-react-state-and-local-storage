/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Projects = new Mongo.Collection('Projects');

Projects.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Projects.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Projects.schema = new SimpleSchema({
  owner: {
    type: String,
    label: 'The ID of the user this project belongs to.',
  },
  image: {
    type: String,
    label: 'The image of the project.',
  },
  title: {
    type: String,
    label: 'The title of the project.',
  },
  description: {
    type: String,
    label: 'The description of the project.',
  },
});

Projects.attachSchema(Projects.schema);

export default Projects;
