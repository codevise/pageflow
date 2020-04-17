import {pageChange} from './actions';

export default function(events, dispatch) {
  events.on('page:change',
            page => dispatch(pageChange({id: page.getPermaId()})));
}
