import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { components } from 'types/schema';
import { SwayamApiResponse } from 'types/SwayamApiResponse';
import { selectItemMapper, flnCatalogGenerator, flnCatalogGeneratorV4, scholarshipCatalogGenerator, IcarCatalogGenerator } from 'utils/generator';

// getting course data
import * as fs from 'fs';
import { HasuraService } from './services/hasura/hasura.service';
const file = fs.readFileSync('./course.json', 'utf8');
const courseData = JSON.parse(file);

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService, private readonly hasuraService: HasuraService) { }

  private nameSpace = process.env.HASURA_NAMESPACE;


  getHello(): string {
    return 'Icar-network Backend is running!!';
  }

  async getCoursesFromFlnV3(body: {
    context: components['schemas']['Context'];
    message: { intent: components['schemas']['Intent'] };
  }) {

    console.log("body 26", JSON.stringify(body))

    const intent: any = body.message.intent;
    console.log('intent: ', intent);

    // destructuring the intent
    const provider = intent?.provider?.descriptor?.name;
    const query = intent?.item?.descriptor?.name;
    const tagGroup = intent?.item?.tags;
    console.log('tag group: ', tagGroup);
    console.log('tag group [0]: ', tagGroup[0]);

    const flattenedTags: any = {};
    if (tagGroup) {
      (tagGroup[0].list as any[])?.forEach((tag) => {
        flattenedTags[tag.name] = tag.value;
      });
    }
    console.log('flattened tags: ', flattenedTags);
    const domain = flattenedTags?.domain !== '' ? flattenedTags?.domain
      : null;
    const theme = flattenedTags?.theme !== '' ? flattenedTags?.theme
      : null;
    const goal = flattenedTags?.goal !== '' ? flattenedTags?.goal
      : null;
    const competency = flattenedTags?.competency !== '' ? flattenedTags?.competency
      : null;
    const language = flattenedTags?.language !== '' ? flattenedTags?.language
      : null;
    const contentType = flattenedTags?.contentType !== '' ? flattenedTags?.contentType
      : null;

    try {

      const resp = await lastValueFrom(
        this.httpService
          .get('https://onest-strapi.tekdinext.com/fln-contents', {
            //  .get('http://localhost:1337/api/fln-contents', {
            params: {
              language: language,
              domain: domain,
              themes: theme,
              goal: goal,
              competency: competency,
              contentType: contentType
            }
          })
          .pipe(map((item) => item.data)),
      );
      console.log("resp", resp)
      const flnResponse: any = resp;
      const catalog = flnCatalogGenerator(flnResponse, query);

      const courseData: any = {
        context: body.context,
        message: {
          catalog: catalog,
        },
      };
      console.log("courseData", courseData)
      console.log("courseData 86", JSON.stringify(courseData))
      return courseData;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  async getCoursesFromFlnV4(body: {
    context: components['schemas']['Context'];
    message: { intent: components['schemas']['Intent'] };
  }) {
    console.log("body 98", JSON.stringify(body))
    const intent: any = body.message.intent;
    console.log('intent: ', intent);

    // destructuring the intent
    const provider = intent?.provider?.descriptor?.name;
    const query = intent?.item?.descriptor?.name;
    const tagGroup = intent?.item?.tags;
    console.log('tag group: ', tagGroup);

    const flattenedTags: any = {};
    if (tagGroup) {
      (tagGroup[0].list as any[])?.forEach((tag) => {
        flattenedTags[tag.name] = tag.value;
      });
    }
    console.log('flattened tags: ', flattenedTags);
    const domain = flattenedTags?.domain !== '' ? flattenedTags?.domain
      : null;
    const theme = flattenedTags?.theme !== '' ? flattenedTags?.theme
      : null;
    const goal = flattenedTags?.goal !== '' ? flattenedTags?.goal
      : null;
    const competency = flattenedTags?.competency !== '' ? flattenedTags?.competency
      : null;
    const language = flattenedTags?.language !== '' ? flattenedTags?.language
      : null;
    const contentType = flattenedTags?.contentType !== '' ? flattenedTags?.contentType
      : null;

    console.log("language", language)

    try {

      const resp = await lastValueFrom(
        this.httpService
          .get('https://onest-strapi.tekdinext.com/api/fln-contents', {
            //  .get('http://localhost:1337/api/fln-contents', {
            params: {
              'filters[language][$eq]': language,
              'filters[domain][$eq]': domain,
              'filters[themes][$eq]': theme,
              'filters[goal][$eq]': goal,
              'filters[competency]': competency,
              'filters[contentType]': contentType
            }
          })
          .pipe(map((item) => item.data.data)),
      );
      console.log("resp", resp)
      const flnResponse: any = resp;
      const catalog = flnCatalogGeneratorV4(flnResponse, query);

      const courseData: any = {
        context: body.context,
        message: {
          catalog: catalog,
        },
      };
      console.log("courseData", courseData)
      console.log("courseData 158", JSON.stringify(courseData))
      return courseData;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  async getCoursesFromFln(body: {
    context: components['schemas']['Context'];
    message: { intent: components['schemas']['Intent'] };
  }) {
    console.log("body 98", JSON.stringify(body))
    const intent: any = body.message.intent;
    console.log('intent: ', intent);

    // destructuring the intent
    const provider = intent?.provider?.descriptor?.name;
    const query = intent?.item?.descriptor?.name;
    const tagGroup = intent?.item?.tags;
    console.log('query: ', query);
    console.log('tag group: ', tagGroup);

    const flattenedTags: any = {};
    if (tagGroup) {
      (tagGroup[0].list as any[])?.forEach((tag) => {
        flattenedTags[tag.name] = tag.value;
      });
    }
    console.log('flattened tags: ', flattenedTags);
    const domain = flattenedTags?.domain !== '' ? flattenedTags?.domain : null;
    const theme = flattenedTags?.theme !== '' ? flattenedTags?.theme : null;
    const goal = flattenedTags?.goal !== '' ? flattenedTags?.goal : null;
    const competency = flattenedTags?.competency !== '' ? flattenedTags?.competency : null;
    const language = flattenedTags?.language !== '' ? flattenedTags?.language : null;
    const contentType = flattenedTags?.contentType !== '' ? flattenedTags?.contentType : null;

    let obj = {}
    if (flattenedTags.domain) {
      obj['domain'] = flattenedTags.domain
    }
    if (flattenedTags?.theme) {
      obj['theme'] = flattenedTags?.theme
    }
    if (flattenedTags?.goal) {
      obj['goal'] = flattenedTags?.goal
    }
    if (flattenedTags?.competency) {
      obj['competency'] = flattenedTags?.competency
    }
    if (flattenedTags?.language) {
      obj['language'] = flattenedTags?.language
    }
    if (flattenedTags?.contentType) {
      obj['contentType'] = flattenedTags?.contentType
    }

    console.log("filter obj", obj)
    console.log("217", body.context.domain)
    try {
      if (body.context.domain == 'onest:learning-experiences') {
        
          const resp = await this.hasuraService.findContent(query)
          console.log("resp", resp.data)
          const flnResponse: any = resp.data.fln_content;
          const catalog = flnCatalogGenerator(flnResponse, query);
          body.context.action = 'on_search'
          const courseData: any = {
            context: body.context,
            message: {
              catalog: catalog,
            },
          };
          console.log("courseData", courseData)
          console.log("courseData 158", JSON.stringify(courseData))
          return courseData;
      } else {
          const resp = await this.hasuraService.findScholarshipContent(query)
          console.log("resp", resp.data)
          const flnResponse: any = resp.data.scholarship_content;
          const catalog = scholarshipCatalogGenerator(flnResponse, query);
          body.context.action = 'on_search'
          const courseData: any = {
            context: body.context,
            message: {
              catalog: catalog,
            },
          };
          console.log("courseData", courseData)
          console.log("courseData 247", JSON.stringify(courseData))
          return courseData;
      }


    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  async handleSelect(selectDto: any) {
    // fine tune the order here

    // order['id'] = selectDto.context.transaction_id + Date.now();

    const itemId = selectDto.message.order.items[0].id;
    const order: any = selectItemMapper(courseData[itemId]);


    // order?.items.map((item) => {
    //   item['descriptor']['long_desc'] = longDes;
    //   item['tags'] = [...item['tags'],]
    // });

    selectDto.message.order = order;
    selectDto.context.action = 'on_select';
    const resp = selectDto;
    return resp;
  }

  async handleInit(selectDto: any) {
    // fine tune the order here
    const itemId = selectDto.message.order.items[0].id;
    const order: any = selectItemMapper(courseData[itemId]);
    order['fulfillments'] = selectDto.message.order.fulfillments;
    selectDto.message.order = order;
    selectDto.context.action = 'on_init';
    const resp = selectDto;
    return resp;
  }

  async handleConfirm(confirmDto: any) {
    // fine tune the order here
    const itemId = confirmDto.message.order.items[0].id;
    const order: any = selectItemMapper(courseData[itemId]);
    order['fulfillments'] = confirmDto.message.order.fulfillments;
    order['id'] = confirmDto.context.transaction_id + Date.now();
    order['state'] = 'COMPLETE';
    order['type'] = 'DEFAULT';
    order['created_at'] = new Date(Date.now());
    order['updated_at'] = new Date(Date.now());
    confirmDto.message.order = order;
    // storing draft order in database
    const createOrderGQL = `mutation insertDraftOrder($order: dsep_orders_insert_input!) {
  insert_dsep_orders_one (
    object: $order
  ) {
    order_id
  }
}`;

    await lastValueFrom(
      this.httpService
        .post(
          process.env.HASURA_URI,
          {
            query: createOrderGQL,
            variables: {
              order: {
                order_id: confirmDto.message.order.id,
                user_id:
                  confirmDto.message?.order?.fulfillments[0]?.customer?.person
                    ?.name,
                created_at: new Date(Date.now()),
                updated_at: new Date(Date.now()),
                status: confirmDto.message.order.state,
                order_details: confirmDto.message.order,
              },
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-hasura-admin-secret': process.env.SECRET,
            },
          },
        )
        .pipe(map((item) => item.data)),
    );

    confirmDto.message.order = order;

    // update order as confirmed in database
    const updateOrderGQL = `mutation updateDSEPOrder($order_id: String, $changes: dsep_orders_set_input) {
      update_dsep_orders (
        where: {order_id: {_eq: $order_id}},
        _set: $changes
      ) {
        affected_rows
        returning {
          order_id
          status
          order_details
        }
      }
    }`;

    try {
      const res = await lastValueFrom(
        this.httpService
          .post(
            process.env.HASURA_URI,
            {
              query: updateOrderGQL,
              variables: {
                order_id: order.id,
                changes: {
                  order_details: order,
                  status: order.state,
                },
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': process.env.SECRET,
              },
            },
          )
          .pipe(map((item) => item.data)),
      );
      console.log('res in test api update: ', res.data);

      confirmDto.message.order = order;
      confirmDto.context.action = 'on_confirm';
      console.log('action: ', confirmDto.context.action);
      return confirmDto;
    } catch (err) {
      console.log('err: ', err);
      throw new InternalServerErrorException(err);
    }
  }

  async getContentFromIcar(body: {
    context: components['schemas']['Context'];
    message: { intent: components['schemas']['Intent'] };
  }) {
    const intent: any = body.message.intent;

    // destructuring the intent
    const provider = intent?.provider?.descriptor?.name;
    const query = intent?.item?.descriptor?.name;
    const tagGroup = intent?.item?.tags;

    const flattenedTags: any = {};
    if (tagGroup) {
      (tagGroup[0].list as any[])?.forEach((tag) => {
        flattenedTags[tag.name] = tag.value;
      });
    }
    const domain = flattenedTags?.domain !== '' ? flattenedTags?.domain : null;
    const theme = flattenedTags?.theme !== '' ? flattenedTags?.theme : null;
    const goal = flattenedTags?.goal !== '' ? flattenedTags?.goal : null;
    const competency = flattenedTags?.competency !== '' ? flattenedTags?.competency : null;
    const language = flattenedTags?.language !== '' ? flattenedTags?.language : null;
    const contentType = flattenedTags?.contentType !== '' ? flattenedTags?.contentType : null;

    let obj = {}
    if (flattenedTags.domain) {
      obj['domain'] = flattenedTags.domain
    }
    if (flattenedTags?.theme) {
      obj['theme'] = flattenedTags?.theme
    }
    if (flattenedTags?.goal) {
      obj['goal'] = flattenedTags?.goal
    }
    if (flattenedTags?.competency) {
      obj['competency'] = flattenedTags?.competency
    }
    if (flattenedTags?.language) {
      obj['language'] = flattenedTags?.language
    }
    if (flattenedTags?.contentType) {
      obj['contentType'] = flattenedTags?.contentType
    }

 
    try {
          const resp = await this.hasuraService.findIcarContent(query)
          const icarResponse: any = resp.data.icar_.Content;
          const catalog = IcarCatalogGenerator(icarResponse, query);
          body.context.action = 'on_search'
          const courseData: any = {
            context: body.context,
            message: {
              catalog: catalog,
            },
          };
          return courseData;
       
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

}
