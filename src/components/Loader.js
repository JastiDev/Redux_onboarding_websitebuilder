import React, {useEffect} from "react";
import {connect} from "react-redux";

import {
  isLoading,
  actionNeverDispatchedSelector,
  getErrorMessage,
} from "../modules/loading";

const mapState = (state, {action, selector}) => ({
  loading: isLoading(action)(state) || !selector(state),
  actionNeverDispatched: actionNeverDispatchedSelector(action)(state),
  result: selector(state),
  error: getErrorMessage(action)(state),
});

const mapDispatch = (dispatch, {action}) => {
  return {
    dispatchAction: params => dispatch(action(params)),
  };
};

const Loader = ({
  loading,
  error,
  result,
  triggerAction,
  actionParams,
  dispatchAction,
  triggerPolicy,
  actionNeverDispatched,
  children,
}) => {
  useEffect(() => {
    if (triggerAction) {
      if (triggerPolicy && triggerPolicy.triggerOnlyOnce) {
        if (actionNeverDispatched) dispatchAction(actionParams);
      } else {
        dispatchAction(actionParams);
      }
    }
  }, [triggerAction, triggerPolicy, actionNeverDispatched, actionParams, dispatchAction]);

  return actionNeverDispatched ? (
    <div>Loading ...</div>
  ) : loading ? (
    <div>Loading ...</div>
  ) : error ? (
    <div>Somethign went wrong</div>
  ) : (
    children(result)
  );
};

export default connect(
  mapState,
  mapDispatch
)(Loader);
