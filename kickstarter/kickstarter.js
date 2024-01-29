import axios from "axios";
import * as cheerio from 'cheerio';

async function getData(url) {
  try {
    const cookies = document.cookie();
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      }});

    const $ = cheerio.load(response.data);

    // const response = await axios.post(url, {
    //   body: [
    //     {
    //       operationName: "CommentsQuery",
    //       query: "query CommentsQuery($commentableId: ID!, $nextCursor: String, $previousCursor: String, $replyCursor: String, $first: Int, $last: Int) {\n  commentable: node(id: $commentableId) {\n    id\n    ... on Project {\n      url\n      __typename\n    }\n    ... on Commentable {\n      canComment\n      canCommentSansRestrictions\n      commentsCount\n      projectRelayId\n      canUserRequestUpdate\n      comments(first: $first, last: $last, after: $nextCursor, before: $previousCursor) {\n        edges {\n          node {\n            ...CommentInfo\n            ...CommentReplies\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          startCursor\n          hasNextPage\n          hasPreviousPage\n          endCursor\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  me {\n    id\n    name\n    imageUrl(width: 200)\n    isKsrAdmin\n    url\n    userRestrictions {\n      restriction\n      releaseAt\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment CommentInfo on Comment {\n  id\n  body\n  createdAt\n  parentId\n  author {\n    id\n    imageUrl(width: 200)\n    name\n    url\n    __typename\n  }\n  removedPerGuidelines\n  authorBadges\n  canReport\n  canDelete\n  canPin\n  hasFlaggings\n  deletedAuthor\n  deleted\n  sustained\n  pinnedAt\n  authorCanceledPledge\n  authorBacking {\n    backingUrl\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment CommentReplies on Comment {\n  replies(last: 3, before: $replyCursor) {\n    totalCount\n    nodes {\n      ...CommentInfo\n      __typename\n    }\n    pageInfo {\n      startCursor\n      hasPreviousPage\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n",
    //       variables: {
    //         commentableId: "UHJvamVjdC0xNjE0Mzk0Njc4", 
    //         nextCursor: null, 
    //         previousCursor: null, 
    //         replyCursor: null,
    //       }
    //     }
    //   ]
    // }, {
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    //     'X-Csrf-Token': $('meta[name="csrf-token"]').attr('content'),
    //   }
    // })
    console.log(cookies);
  } catch (err) {
    console.log(err);
  }
}

async function getComments() {
  const url = 'https://www.kickstarter.com/projects/doctorow/the-bezzle-a-martin-hench-audiobook-amazon-wont-sell/comments';
  await getData(url);
}

getComments();