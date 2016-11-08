import React, { PropTypes } from 'react';

import Downloader from '../Downloader';
import Storage from '../Storage';
import Keyboard from '../Keyboard';

import StoryComponent from './StoryComponent';
import CounterComponent from './CounterComponent';
import LoadingComponent from './LoadingComponent';
import EmptyStoriesComponent from './EmptyStoriesComponent';

class ViewerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let { url, currentViewer } = this.props;

    this.setState({ loading: true, empty: false });

    Downloader.create(url, (stories) => {
      this._store(stories);
    });

    Keyboard.define(this);
  }

  render() {
    let { loading, currentStory, storyQueue, currentStoryIndex, empty } = this.state;
    let { relations } = this.props

    if (empty) {
      return (
        <EmptyStoriesComponent />
      )
    }

    if (loading || currentStory === undefined) {
      return (
        <LoadingComponent />
      )
    }

    return (
      <div id={'story-container'} className={'full-screen'}>
        <StoryComponent
          Link={currentStory[relations.Link]}
          Subtitle={currentStory[relations.Subtitle]}
          Title={currentStory[relations.Title]}
        />

        <CounterComponent
          Current={String(currentStoryIndex + 1)}
          Total={String(storyQueue.length)}
        />
      </div>
    )
  }

  _store(stories) {
    let { identifier, relations } = this.props
    const readStories = Storage.retrieve(identifier);

    const filteredStories = stories.filter(story => readStories.indexOf(story[relations.ElementKey]) == -1);

    const mappedStories = filteredStories.map(story => {
      var matches = story.url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
      var domain = matches && matches[1];
      return Object.assign({}, story, {
        domain: domain
      });
    });

    this.setState({
      storyQueue: mappedStories,
      loading: false,
      empty: mappedStories.length == 0,
      currentStoryIndex: 0
    });

    if (mappedStories.length > 0) {
      this._show(mappedStories[0]);
    }
  }

  _show(story) {
    let { identifier, relations } = this.props

    Storage.store(identifier, story[relations.ElementKey]);

    this.setState({currentStory: story});
  }

  _setByIndex(index) {
    let story = this.state.storyQueue[index];

    this.setState({
      currentStoryIndex: index,
    });

    this._show(story);
  }

  next() {
    let existsNextStory = this.state.currentStoryIndex < (this.state.storyQueue.length - 1);

    if (existsNextStory) {
      this._setByIndex(this.state.currentStoryIndex + 1);
    }
  }

  prev() {
    let existsPreviousStory = this.state.currentStoryIndex > 0;

    if (existsPreviousStory) {
      this._setByIndex(this.state.currentStoryIndex - 1);
    }
  }

  open_current() {
    this._open(this.state.currentStory.url);
  }

  _open(url) {
    window.open(url);
  }
}

ViewerComponent.propTypes = {
  identifier: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  relations: PropTypes.object.isRequired,
  currentViewer: PropTypes.string.isRequired
};

export default ViewerComponent;
