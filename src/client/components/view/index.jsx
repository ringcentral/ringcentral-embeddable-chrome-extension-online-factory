/**
 * check poll details
 * and poll records
 */

import { Component } from 'react'
import {
  Tabs,
  Modal,
  Button,
  Spin
} from 'antd'
import {
  GithubFilled,
  HighlightOutlined,
  PieChartOutlined
} from '@ant-design/icons'
import Form from '../common/form'
import {
  createExt
} from '../../common/apis'

const { TabPane } = Tabs

export default class View extends Component {
  state = {
    loading: false,
    inst: {
      name: 'my-ringcentral-embeddable-extension',
      desc: 'My ringcentral-embeddable chrome extension',
      matches: [
        {
          title: 'https://*.my-site.com/*'
        }
      ],
      excludeMatches: [
      ],
      phoneSelectors: []
    },
    file: '',
    tab: 'basic' // or advanced
  }

  componentDidMount () {
    window.particleBg('#bg', {
      color: '#fff'
    })
  }

  submit = async (res) => {
    this.setState({
      loading: true
    })
    const up = {
      loading: false
    }
    const inst = {
      ...res,
      matches: res.matches.map(d => d.title),
      excludeMatches: res.excludeMatches.map(d => d.title),
      phoneSelectors: res.phoneSelectors.map(d => d.title)
    }
    const r = await createExt(inst)
    if (r && r.file) {
      up.file = r.file
    }
    this.setState(up)
    return !!r
  }

  handleClose = () => {
    this.setState({
      file: ''
    })
  }

  renderModal = () => {
    const {
      file
    } = this.state
    if (!file) {
      return null
    }
    return (
      <Modal
        title='Done!'
        footer={null}
        visible
        onCancel={this.handleClose}
      >
        <div className='pd1b bold'>
          Ringcentral embeddable Chrome extension build done, click to download.
        </div>
        <p>
          <a href={window.rc.server + '/d/' + file}>
            <Button type='primary'>Download</Button>
          </a>
        </p>
        <div className='pd1b bold'>
          How to use
        </div>
        <ul>
          <li>Unpack it, will get a folder, open your Chrome extension page(<a target='_blank' rel='noreferrer' href='chrome://extensions/'>chrome://extensions/</a>), make sure you enable the developer mode, click load unpacked, select the folder</li>
          <li>Go to your website to check</li>
          <li>Make sure you <b>turn off</b> "Block third-party cookies" in <a target='_blank' rel='noreferrer' href='chrome://settings/content/cookies'>chrome://settings/content/cookies</a></li>
          <li>Want to customize more? Check <a target='_blank' rel='noreferrer' href='https://github.com/ringcentral/ringcentral-embeddable-extension-factory'>https://github.com/ringcentral/ringcentral-embeddable-extension-factory</a></li>
        </ul>
      </Modal>
    )
  }

  renderDetail = () => {
    return (
      <Form
        initialValues={this.state.inst}
        submit={this.submit}
      />
    )
  }

  renderLoading () {
    return (
      <div className='pd3 aligncenter'>
        Loading...
      </div>
    )
  }

  renderFooter = () => {
    return (
      <div className='pd3y'>
        <p><PieChartOutlined />Ringcentral embeddable Chrome extension online factory</p>
        <p>
          <a
            href={window.rc.feedbackUrl}
            target='_blank'
            rel='noreferrer'
          >
            <HighlightOutlined /> Feedback
          </a>
          <a
            className='mg1l'
            href={window.rc.github}
            target='_blank'
            rel='noreferrer'
          >
            <GithubFilled /> GitHub repo
          </a>
        </p>
      </div>
    )
  }

  renderContent = () => {
    const tabs = [
      {
        id: 'basic',
        title: 'Basic',
        func: this.renderDetail
      }
    ]
    return (
      <div className='wrap'>
        <div className='pd3y'>
          <Spin
            spinning={this.state.loading}
            tip='Building extension...'
          >
            <Tabs
              activeKey={this.state.tab}
              onTabClick={this.handleTab}
            >
              {
                tabs.map(t => {
                  const {
                    id, title, func
                  } = t
                  return (
                    <TabPane key={id} tab={title}>
                      {func()}
                    </TabPane>
                  )
                })
              }
            </Tabs>
            {this.renderModal()}
            {this.renderFooter()}
          </Spin>
        </div>
      </div>
    )
  }

  render () {
    return this.renderContent()
  }
}
