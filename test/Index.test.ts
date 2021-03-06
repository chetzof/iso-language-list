import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import fetch from 'jest-fetch-mock'
import { TranslationApi } from '@/translation-api'

const api = new TranslationApi('231123')
beforeEach(() => {
  fetch.resetMocks()
  fetch.doMock()
})
test('That the function passes through the data', async () => {
  const dataset = {
    test1: 'bar',
    test2: { inner: 'foo' },
  }
  fetch.mockResponseOnce(async (request: Request) => {
    return JSON.stringify({
      data: {
        translations: [
          {
            translatedText: new URLSearchParams(await request.text()).get('q'),
          },
        ],
      },
    })
  })

  const result = await api.translate('lang', dataset)
  expect(result).toEqual(dataset)
})

test('That it encodes the flat translation map into pseudo-XML', async () => {
  const encodingResults = api['encode']({
    test1: 'bar',
    test2: { inner: 'foo' },
  })
  expect(encodingResults).toEqual(
    '<test1>bar</test1><test2.inner>foo</test2.inner>',
  )
})

it('Decode data from pseudo-XML to nested message object', async () => {
  const decodingResults = api[
    'decode'
  ]('<test1>bar</test1><test2.inner>foo</test2.inner>', [
    'test1',
    'test2.inner',
  ])

  expect(decodingResults).toEqual({ test1: 'bar', test2: { inner: 'foo' } })
})
