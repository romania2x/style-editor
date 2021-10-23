import React from 'react'
import PropTypes from 'prop-types'
import Slugify from 'slugify'
import {saveAs} from 'file-saver'
import pkgLockJson from '../../package-lock.json'

import {format} from '@mapbox/mapbox-gl-style-spec'
import InputButton from './InputButton'
import Modal from './Modal'
import {MdFileDownload, MdSave} from 'react-icons/md'
import style from '../libs/style'
import {saveStyle} from "../libs/urlopen";


const MAPBOX_GL_VERSION = pkgLockJson.dependencies["mapbox-gl"].version;


export default class ModalExport extends React.Component {
  static propTypes = {
    mapStyle: PropTypes.object.isRequired,
    onStyleChanged: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpenToggle: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  tokenizedStyle() {
    return format(
      style.stripAccessTokens(
        style.replaceAccessTokens(this.props.mapStyle)
      )
    );
  }

  exportName() {
    if (this.props.mapStyle.name) {
      return Slugify(this.props.mapStyle.name, {
        replacement: '_',
        remove: /[*\-+~.()'"!:]/g,
        lower: true
      });
    } else {
      return this.props.mapStyle.id
    }
  }

  save() {
    saveStyle(this.props.mapStyle.id, this.tokenizedStyle(), () => {
      this.props.onOpenToggle(false);
    });
    return;

    const blob = new Blob([html], {type: "text/html;charset=utf-8"});
    const exportName = this.exportName();
    saveAs(blob, exportName + ".html");
  }

  downloadStyle() {
    const tokenStyle = this.tokenizedStyle();
    const blob = new Blob([tokenStyle], {type: "application/json;charset=utf-8"});
    const exportName = this.exportName();
    saveAs(blob, exportName + ".json");
  }

  changeMetadataProperty(property, value) {
    const changedStyle = {
      ...this.props.mapStyle,
      metadata: {
        ...this.props.mapStyle.metadata,
        [property]: value
      }
    }
    this.props.onStyleChanged(changedStyle)
  }


  render() {
    return <Modal
      data-wd-key="modal:export"
      isOpen={this.props.isOpen}
      onOpenToggle={this.props.onOpenToggle}
      title={'Save or Export style'}
      className="maputnik-export-modal"
    >

      <section className="maputnik-modal-section">
        <h1>Save style</h1>
        <p>
          Save or download a JSON style to your computer.
        </p>
        <p></p>
        <div className="maputnik-modal-export-buttons">
          <InputButton
            onClick={this.downloadStyle.bind(this)}
          >
            <MdFileDownload/>
            Download Style
          </InputButton>

          <InputButton
            onClick={this.save.bind(this)}
          >
            <MdSave/>
            Save
          </InputButton>
        </div>
      </section>

    </Modal>
  }
}

