# Setting up S3 Bucket Policies

For Zencoder to be able to access S3 buckets of your AWS account, the
following bucket policies have to be configured. In addition we're
granting public read access to the entire bucket, which is needed
before we can start using S3 as a web server.

Note that `<main bucket>` and `<output bucket>` have to be replaced
with the correct bucket names below.

Grant read access to main bucket:

    {
      "Version": "2017-06-20",
      "Id": "PageflowMainBucketPolicy",
      "Statement": [
        {
          "Sid": "Stmt1497951043738",
          "Action": [
            "s3:GetObject"
          ],
          "Effect": "Allow",
          "Resource": "arn:aws:s3:::<main bucket>/*",
          "Principal": "*"
        },
        {
          "Sid": "Stmt1295042087538",
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::395540211253:root"
          },
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::<main bucket>/*"
        },
        {
          "Sid": "Stmt1295042087538",
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::395540211253:root"
          },
          "Action": [
            "s3:ListBucketMultipartUploads",
            "s3:GetBucketLocation"
          ],
          "Resource": "arn:aws:s3:::<main bucket>"
        }
      ]
    }

Grant full access to output bucket:

    {
      "Version": "2017-06-20",
      "Id": "PageflowOutputBucketPolicy",
      "Statement": [
        {
          "Sid": "Stmt1497951043738",
          "Action": [
            "s3:GetObject"
          ],
          "Effect": "Allow",
          "Resource": "arn:aws:s3:::<output bucket>/*",
          "Principal": "*"
        },
        {
          "Sid": "Stmt1295042087538",
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::395540211253:root"
          },
          "Action": [
            "s3:GetObject",
            "s3:PutObjectAcl",
            "s3:ListMultipartUploadParts",
            "s3:PutObject"
          ],
          "Resource": "arn:aws:s3:::<output bucket>/*"
        },
        {
          "Sid": "Stmt1295042087538",
          "Effect": "Allow",
          "Principal": {
            "AWS": "arn:aws:iam::395540211253:root"
          },
          "Action": [
            "s3:ListBucketMultipartUploads",
            "s3:GetBucketLocation"
          ],
          "Resource": "arn:aws:s3:::<output bucket>"
        }
      ]
    }

See also
[Using Zencoder with S3](https://app.zencoder.com/docs/guides/getting-started/working-with-s3)
