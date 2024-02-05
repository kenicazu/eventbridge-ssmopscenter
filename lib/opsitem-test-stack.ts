import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class OpsitemTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // using L2 Construct (AwsApi)
    const rule = new events.Rule(this, "L2Rule", {
      eventPattern: {
        source: ["aws.ec2"],
        detailType: ["AWS API Call via CloudTrail"],
        detail: {
          eventName: ["RunInstances"],
        },
      },
    });
    const apiTarget = new targets.AwsApi({
      action: "CreateOpsItem",
      service: "SSM",
      parameters: {
        Title: "Create OpsItem",
        Source: "EventBridge",
        Description: "Test OpsItem",
      },
    });

    rule.addTarget(apiTarget);

    // using L1 Construct 
    const cfnRule = new events.CfnRule(this, 'L1Rule', {
      description: 'using L1 Construct',
      eventBusName: 'default',
      eventPattern: {
        source: ["aws.ec2"],
        detailType: ["AWS API Call via CloudTrail"],
        detail: {
          eventName: ["RunInstances"],
        },
      },
      state: 'ENABLED',
      targets: [{
        arn: 'arn:aws:ssm:ap-northeast-1:131423435875:opsitem',
        roleArn: 'arn:aws:iam::131423435875:role/service-role/OpsItem-CWE-Role',
        id: 'takosuke',
      }],
    });

  }
}


