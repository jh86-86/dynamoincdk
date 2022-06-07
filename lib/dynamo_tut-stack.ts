import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DynamoTutStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

 
    // my table

    const myTable = new Table(this, 'JJDemoTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {name: 'id', type: AttributeType.STRING},
      tableName: 'JJDemoTable',
    });

    // lambda function

    const myFunction = new Function(this, 'JJDemoFunction',{
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("resources"),
      handler: 'app.handler',
      environment: {
        MY_TABLE: myTable.tableName
      }
    });

    myTable.grantReadWriteData(myFunction);

    const myApiGateway = new RestApi(this, "JJDemoApiGateway")

    const myFunctionAPIGatewayIntegration = new LambdaIntegration(myFunction, {
      requestTemplates:{"application/json": '{"status": "200"}'}
    });

    myApiGateway.root.addMethod("GET", myFunctionAPIGatewayIntegration);


  }
}
