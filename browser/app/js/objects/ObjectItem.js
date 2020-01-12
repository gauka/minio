/*
 * MinIO Cloud Storage (C) 2018 MinIO, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react"
import { connect } from "react-redux"
import humanize from "humanize"
import Moment from "moment"
import { getDataType } from "../mime"
import * as actions from "./actions"
import { getCheckedList } from "./selectors"

export class ObjectItem extends React.PureComponent {
  constructor(props) {
    super(props)
    const { name, contentType } = props
    this.state = {
      previewBlockIsVisible: false,
    }
    this.setPreviewImage = this.setPreviewImage.bind(this)
    this.dataType = getDataType(name, contentType)
    this.isImage = this.dataType === 'image'
  }

  setPreviewImage(value) {
    const { objectUrl } = this.props
    if (!objectUrl) return
    this.setState({ previewBlockIsVisible: value })
  }

  render() {
    const {
      name,
      size,
      lastModified,
      checked,
      checkObject,
      uncheckObject,
      actionButtons,
      onClick,
      objectUrl,
    } = this.props
    const { previewBlockIsVisible } = this.state
    return (
      <div className={"fesl-row"} data-type={this.dataType}>
        {previewBlockIsVisible && 
          <img
            className="preview"
            src={objectUrl}
          />
        }
        <div className="fesl-item fesl-item-icon" 
          onMouseOver={() => this.isImage ? this.setPreviewImage(true) : null}
          onMouseLeave={() => this.isImage ? this.setPreviewImage(false) : null}
        >
          <div className="fi-select">
            <input
              type="checkbox"
              name={name}
              checked={checked}
              onChange={() => {
                checked ? uncheckObject(name) : checkObject(name)
              }}
            />
            <i className="fis-icon" />
            <i className="fis-helper" />
          </div>
        </div>
        <div className="fesl-item fesl-item-name">
          <a
            href={this.dataType === "folder" ? name : "#"}
            onClick={e => {
              e.preventDefault()
              if (onClick) {
                onClick()
              }
            }}
          >
            {name}
          </a>
        </div>
        <div className="fesl-item fesl-item-size">{size}</div>
        <div className="fesl-item fesl-item-modified">{lastModified}</div>
        <div className="fesl-item fesl-item-actions">{actionButtons}</div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    checked: getCheckedList(state).indexOf(ownProps.name) >= 0
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkObject: name => dispatch(actions.checkObject(name)),
    uncheckObject: name => dispatch(actions.uncheckObject(name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectItem)
