import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Projects from './Projects';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
  'projects.insert': function documentsInsert(project) {
    check(project, {
      image: String,
      title: String,
      body: String,
    });

    try {
      return Projects.insert({ owner: this.userId, ...project });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: ['documents.insert'],
  limit: 5,
  timeRange: 1000,
});
