import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import ViewerComponent from 'components/ViewerComponent';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    let { viewers } = this.props;
    let first_viewer = viewers[0];
    let first_viewer_identifier = first_viewer.identifier;

    this.setState({ currentViewer: first_viewer_identifier  });
  }

  render() {
    let { viewers } = this.props;
    let { currentViewer } = this.state;

    return (
      <div className={'viewers-containers'}>
        {viewers.map((viewer) =>
          <ViewerComponent
            url={viewer.url}
            relations={viewer.relations}
            identifier={viewer.identifier}
            key={viewer.identifier}
            currentViewer={currentViewer}
          />
        )}
      </div>
    )
  }
}

Index.propTypes = {
  viewers: PropTypes.array.isRequired
};

Index.defaultProps = {
  viewers: [
    {
      identifier: 'hackernews_one',
      url: 'https://polar-ridge-70990.herokuapp.com',
      relations: {
        ElementKey: 'id',
        Title: 'title',
        Subtitle: 'domain',
        Link: 'url'
      }
    }
  ]
}

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
