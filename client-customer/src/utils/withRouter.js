import { useParams, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let params = useParams(); // Lấy ID từ URL (như cid, id)
    let navigate = useNavigate();
    let location = useLocation();
    return (
      <Component
        {...props}
        params={params}
        navigate={navigate}
        location={location}
      />
    );
  }
  return ComponentWithRouterProp;
}

export default withRouter;