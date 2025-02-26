import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const CustomLink = ({to, children, className, ...rest}) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end: true});

    const isExcluded = to === "/login";

  return (
    <Link to={to} {...rest} children={children}
    className={`custom-link ${isActive && !isExcluded ? 'active' : ''} ${className}`}>
    </Link>
  )
}

export default CustomLink