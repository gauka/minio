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
import { Dropdown } from "react-bootstrap"
import ShareObjectModal from "./ShareObjectModal"
import DeleteObjectConfirmModal from "./DeleteObjectConfirmModal"
import * as objectsActions from "./actions"
import {
  SHARE_OBJECT_EXPIRY_DAYS,
  SHARE_OBJECT_EXPIRY_HOURS,
  SHARE_OBJECT_EXPIRY_MINUTES
} from "../constants"
import { hasServerPublicDomain } from '../browser/selectors'

export class ObjectActions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDeleteConfirmation: false
    }
    this.copyObjectURL = this.copyObjectURL.bind(this)
  }
  copyObjectURL(e) {
    e.preventDefault()
    const { object, copyObjectURL } = this.props
    copyObjectURL(object)
  }
  shareObject(e) {
    e.preventDefault()
    const { object, shareObject } = this.props
    shareObject(
      object.name,
      SHARE_OBJECT_EXPIRY_DAYS,
      SHARE_OBJECT_EXPIRY_HOURS,
      SHARE_OBJECT_EXPIRY_MINUTES
    )
  }
  deleteObject() {
    const { object, deleteObject } = this.props
    deleteObject(object.name)
  }
  showDeleteConfirmModal(e) {
    e.preventDefault()
    this.setState({ showDeleteConfirmation: true })
  }
  hideDeleteConfirmModal() {
    this.setState({
      showDeleteConfirmation: false
    })
  }
  render() {
    const { object, showShareObjectModal, shareObjectName, hasServerPublicDomain } = this.props
    return (
      <Dropdown id={`obj-actions-${object.name}`}>
        <Dropdown.Toggle noCaret className="fia-toggle" />
        <Dropdown.Menu>
          {hasServerPublicDomain && (
            <a
              href=""
              className="fiad-action"
              onClick={this.copyObjectURL}
            >
              <i className="fas fa-copy" />
            </a>
          )}
          <a
            href=""
            className="fiad-action"
            onClick={this.shareObject.bind(this)}
          >
            <i className="fas fa-share-alt" />
          </a>
          <a
            href=""
            className="fiad-action"
            onClick={this.showDeleteConfirmModal.bind(this)}
          >
            <i className="fas fa-trash-alt" />
          </a>
        </Dropdown.Menu>
        {(showShareObjectModal && shareObjectName === object.name) &&
          <ShareObjectModal object={object} />}
        {this.state.showDeleteConfirmation && (
          <DeleteObjectConfirmModal
            deleteObject={this.deleteObject.bind(this)}
            hideDeleteConfirmModal={this.hideDeleteConfirmModal.bind(this)}
          />
        )}
      </Dropdown>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    object: ownProps.object,
    showShareObjectModal: state.objects.shareObject.show,
    shareObjectName: state.objects.shareObject.object,
    hasServerPublicDomain: hasServerPublicDomain(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    shareObject: (object, days, hours, minutes) =>
      dispatch(objectsActions.shareObject(object, days, hours, minutes)),
    deleteObject: object => dispatch(objectsActions.deleteObject(object)),
    copyObjectURL: object => dispatch(objectsActions.copyObjectURL(object)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ObjectActions)
