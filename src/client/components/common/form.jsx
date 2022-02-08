
import { Form, Input, Button, Tooltip } from 'antd'
import { PlusOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'

const { Item, List } = Form

export default function FormVote (props) {
  const [form] = Form.useForm()
  function renderList ({
    title,
    name,
    minLength = 1,
    placeholder
  }) {
    return (
      <List
        name={name}
      >
        {
          (fields, { add, remove }, { errors }) => {
            return (
              <div>
                {
                  fields.map((field, i) => {
                    return renderItem(field, i, add, remove, placeholder, minLength)
                  })
                }
                <Item>
                  <Button
                    type='dashed'
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    New {title} url
                  </Button>
                </Item>
              </div>
            )
          }
        }
      </List>
    )
  }
  function renderItem (field, i, add, remove, placeholder, minLength) {
    const after = i > minLength - 1
      ? (
        <MinusCircleOutlined
          className='pointer'
          onClick={() => remove(field.name)}
        />
        )
      : null
    return (
      <Item
        {...field}
        name={[field.name, 'title']}
        fieldKey={[field.fieldKey, 'title']}
        rules={[
          {
            required: true,
            message: 'url required'
          }, {
            max: 530,
            message: '530 chars max'
          }
        ]}
      >
        <Input
          addonBefore={`${i + 1}.`}
          placeholder={placeholder}
          addonAfter={after}
        />
      </Item>
    )
  }
  function matchTooltip () {
    return (
      <div>
        Extension will only runs in matched hosts, like "https://*.my-site.com/*", check details about match pattern from <a target='_blank' rel='noreferrer' href='https://developer.chrome.com/docs/extensions/mv2/match_patterns/'>https://developer.chrome.com/docs/extensions/mv2/match_patterns/</a>
      </div>
    )
  }
  function excludeMatchTooltip () {
    return (
      <div>
        Exclude Extension from running in some hosts, like "https://subsite-to-exclude.my-site.com/*", check details about match pattern from <a target='_blank' rel='noreferrer' href='https://developer.chrome.com/docs/extensions/mv2/match_patterns/'>https://developer.chrome.com/docs/extensions/mv2/match_patterns/</a>
      </div>
    )
  }
  async function doSubmit (res) {
    const r = await props.submit(res)
    if (r) {
      form.resetFields()
    }
  }
  // useEffect(() => {
  //   props.app.on('submit', async (e) => {
  //     console.log(e.data.payload)
  //     // do something like submit
  //     const submitSuccess = await doSubmit()
  //     return {
  //       status: !!submitSuccess
  //       // true means submit success, RingCentral app will close integration window
  //     }
  //   })
  // }, [])
  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={doSubmit}
      initialValues={props.initialValues}
    >
      <Item
        name='name'
        label='Name'
        rules={[
          {
            required: true,
            message: 'Required'
          },
          {
            max: 200
          }
        ]}
      >
        <Input />
      </Item>
      <Item
        name='Description'
        label='desc'
        rules={[
          {
            max: 1000
          }
        ]}
      >
        <Input.TextArea row={2} />
      </Item>
      <div>
        <span>Matches</span>
        <Tooltip
          title={matchTooltip()}
        >
          <QuestionCircleOutlined className='mg1l' />
        </Tooltip>
      </div>
      {renderList({
        name: 'matches',
        title: 'match',
        placeholder: 'https://*.my-site.com/*'
      })}
      <div>
        <span>Exclude Matches</span>
        <Tooltip
          title={excludeMatchTooltip()}
        >
          <QuestionCircleOutlined className='mg1l' />
        </Tooltip>
      </div>
      {renderList({
        name: 'excludeMatches',
        minLength: 0,
        title: 'exclude match',
        placeholder: 'https://url-will-be-exluded.my-site.com/*'
      })}
      <Item>
        <Button
          size='large'
          htmlType='submit'
          type='primary'
        >
          Create
        </Button>
      </Item>
    </Form>
  )
}
