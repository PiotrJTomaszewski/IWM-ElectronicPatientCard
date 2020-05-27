import React from 'react';

const RawHtml = ({children, className = ""}) => 
<div className={className}
  dangerouslySetInnerHTML={{ __html: children.replace(/\n/g, '<br />')}} />

export default RawHtml;